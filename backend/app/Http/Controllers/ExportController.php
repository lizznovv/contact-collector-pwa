<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function leads(Request $request)
    {
        $query = Lead::query()->with('products');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $leads = $query->get();

        $format = $request->input('format', 'xlsx'); // csv или xlsx

        return $format === 'xlsx'
            ? $this->exportXlsx($leads)
            : $this->exportCsv($leads);
    }

    private function exportCsv($leads)
    {
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="leads_' . now()->format('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($leads) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'ID', 'Фио', 'Телефон', 'Email',
                'Мероприятие', 'Компания', 'Должность',
                'Статус', 'Продукты', 'Дата создания'
            ], ';');

            foreach ($leads as $lead) {
                $products = $lead->products->pluck('name')->join(', ');

                fputcsv($handle, [
                    $lead->id,
                    $lead->full_name ?? '',
                    $lead->phone ?? '',
                    $lead->email ?? '',
                    $lead->event_id ?? '',
                    $lead->company ?? '',
                    $lead->position ?? '',
                    $lead->status ?? '',
                    $products,
                    $lead->created_at?->format('d.m.Y H:i'),
                ], ';');
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportXlsx($leads)
    {
        $rows = [];
        $rows[] = [
            'ID', 'Фио', 'Телефон', 'Email',
            'Мероприятие', 'Компания', 'Должность',
            'Статус', 'Продукты', 'Дата создания'
        ];

        foreach ($leads as $lead) {
            $products = $lead->products->pluck('name')->join(', ');
            $rows[] = [
                $lead->id,
                $lead->full_name ?? '',
                $lead->phone ?? '',
                $lead->email ?? '',
                $lead->event_id ?? '',
                $lead->company ?? '',
                $lead->position ?? '',
                $lead->status ?? '',
                $products,
                $lead->created_at?->format('d.m.Y H:i'),
            ];
        }

        $xml = $this->buildXlsx($rows);
        $filename = 'leads_' . now()->format('Y-m-d') . '.xlsx';

        return response($xml)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', "attachment; filename=\"$filename\"");
    }

    private function buildXlsx(array $rows): string
    {
        if (class_exists(\PhpOffice\PhpSpreadsheet\Spreadsheet::class)) {
            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            foreach ($rows as $rowIndex => $row) {
                foreach ($row as $colIndex => $value) {
                    $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex + 1);
                    $sheet->setCellValue($col . ($rowIndex + 1), $value);
                }
            }

            $sheet->getStyle('A1:J1')->getFont()->setBold(true);

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            ob_start();
            $writer->save('php://output');
            return ob_get_clean();
        }

        return '';
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function leads(Request $request)
    {
        $query = Lead::with([
            'user',
            'event',
            'products'
        ]);

        if ($request->manager_id) {
            $query->where('user_id', $request->manager_id);
        }

        if ($request->event_id) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->product_id) {
            $query->whereHas('products', function ($q) use ($request) {
                $q->where('products.id', $request->product_id);
            });
        }

        if ($request->date_from || $request->date_to) {

            $query->whereHas('event', function ($eventQuery) use ($request) {

                if ($request->date_from) {
                    $eventQuery->whereDate('event_date', '>=', $request->date_from);
                }

                if ($request->date_to) {
                    $eventQuery->whereDate('end_date', '<=', $request->date_to);
                }
            });
        }

        $leads = $query->get();
        $format = $request->input('format', 'xlsx');

        AuditLogger::log('EXPORT', payload: [
            'format'  => $format,
            'count'   => $leads->count(),
            'filters' => $request->only(
                'manager_id',
                'event_id',
                'product_id',
                'date_from',
                'date_to'
            ), ]);

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
            fwrite($handle, "\xEF\xBB\xBF");


            fputcsv($handle, [
                'ID', 'ФИО', 'Телефон', 'Email', 'Менеджер',
                'Мероприятие', 'Дата начала', 'Дата окончания',
                'Компания', 'Должность', 'Комментарий', 'Сервисы'
            ], ';');

            foreach ($leads as $lead) {
                $products = $lead->products->pluck('name')->join(', ');

                fputcsv($handle, [
                    $lead->id,
                    $lead->full_name ?? '',
                    $lead->phone ?? '',
                    $lead->email ?? '',
                    $lead->user?->name ?? '',
                    $lead->event?->name ?? '',
                    $lead->event?->event_date ?? '',
                    $lead->event?->end_date ?? '',
                    $lead->company ?? '',
                    $lead->position ?? '',
                    $lead->comments ?? '',
                    $products,
                ], ';');
            }

            fclose($handle);
        };
        if (ob_get_length()) ob_end_clean();

        return response()->stream($callback, 200, $headers);
    }


    private function exportXlsx($leads)
    {
        $rows = [];
        $rows[] = [
            'ID', 'ФИО', 'Телефон', 'Email', 'Менеджер',
            'Мероприятие', 'Дата начала', 'Дата окончания',
            'Компания', 'Должность',  'Комментарий', 'Сервисы'
        ];

        foreach ($leads as $lead) {
            $products = $lead->products->pluck('name')->join(', ');
            $rows[] = [
                $lead->id,
                $lead->full_name ?? '',
                $lead->phone ?? '',
                $lead->email ?? '',
                $lead->user?->name ?? '',
                $lead->event?->name ?? '',
                $lead->event?->event_date ?? '',
                $lead->event?->end_date ?? '',
                $lead->company ?? '',
                $lead->position ?? '',
                $lead->comments ?? '',
                $products,
            ];
        }

        try {
            $xml = $this->buildXlsx($rows);
            $filename = 'leads_' . now()->format('Y-m-d') . '.xlsx';

            return response($xml)
                ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                ->header('Content-Disposition', "attachment; filename=\"$filename\"");
        }
        catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function buildXlsx(array $rows): string
    {
        if (!class_exists(\PhpOffice\PhpSpreadsheet\Spreadsheet::class)) {
            throw new \Exception('Библиотека PhpSpreadsheet не найдена. Установите: composer require phpoffice/phpspreadsheet');
        }
        if (!extension_loaded('gd')) {
            throw new \Exception('Расширение PHP "GD" не установлено. Установите его для работы экспорта.');
        }

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($rows as $rowIndex => $row) {
            foreach ($row as $colIndex => $value) {
                $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex + 1);
                $sheet->setCellValue($col . ($rowIndex + 1), $value);
            }
        }

        $sheet->getStyle('A1:K1')->getFont()->setBold(true);
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

        if (ob_get_length()) ob_end_clean();

        ob_start();
        $writer->save('php://output');
        return ob_get_clean();
    }

}

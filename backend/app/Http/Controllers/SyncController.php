<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SyncController extends Controller
{
    public function sync(Request $request)
    {
        $items = $request->input('leads');
        if (!$items) {
            return response()->json([
                'message' => 'No leads provided.'
            ], 422);
        }

        if (!array_is_list($items)) {
            $items = [$items];
        }

        $results = [];

        foreach ($items as $item) {
            try {
                $lead = Lead::find($item['id'] ?? null);

                if (!$lead) {
                    $results[] = [
                        'id'     => $item['id'] ?? null,
                        'status' => 'error',
                        'code'   => 404,
                        'message' => 'Lead not found.',
                    ];
                    continue;
                }

                DB::transaction(function () use ($lead, $request) {
                    $previousStatus = $lead->status;

                    $lead->update(['status' => 'synced']);

                    AuditLogger::log(
                        actionType: 'sync',
                        entityType: 'lead',
                        entityId: $lead->id,
                        payload: [
                            'previous_status' => $previousStatus,
                            'new_status'      => 'synced',
                        ]
                    );
                });

                $results[] = [
                    'id'     => $lead->id,
                    'status' => 'synced',
                    'code'   => 200,
                ];

                AuditLogger::log('SYNC_SUCCESS');

            } catch (\Exception $exception) {
                AuditLogger::log('SYNC_ERROR', 'error', errorMessage: $exception->getMessage());
                throw $exception;
            }
        }

        $hasErrors = collect($results)->contains('status', 'error');
        $allErrors = collect($results)->every(fn($r) => $r['status'] === 'error');

        return response()->json([
            'results' => $results,
        ], $allErrors ? 500 : ($hasErrors ? 207 : 200));
    }
}

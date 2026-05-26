<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function index()
    {
        $dbStatus = 'ok';

        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $dbStatus = 'error';
        }

        return response()->json([
            'status' => $dbStatus === 'ok' ? 'ok' : 'degraded',
            'database' => $dbStatus,
            'timestamp' => now()->toIso8601String(),
            'audit_logs' => AuditLog::count(),
        ]);
    }
}

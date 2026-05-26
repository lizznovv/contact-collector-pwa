<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::query()
            ->when($request->user_id,     fn($q) => $q->where('user_id', $request->user_id))
            ->when($request->action_type, fn($q) => $q->where('action_type', $request->action_type))
            ->when($request->status,      fn($q) => $q->where('status', $request->status))
            ->when($request->from,        fn($q) => $q->where('created_at', '>=', $request->from))
            ->when($request->to,          fn($q) => $q->where('created_at', '<=', $request->to))
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }

    public function show($id)
    {
        $log = AuditLog::with('user:id,name,email')->findOrFail($id);

        return response()->json($log);
    }
}

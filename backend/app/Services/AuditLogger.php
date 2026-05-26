<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    public static function log(
        string  $actionType,
        string  $status = 'success',
        ?string $entityType = null,
        ?int    $entityId = null,
        ?array  $payload = null,
        ?string $errorMessage = null
    ): void {
        AuditLog::create([
            'user_id'       => Auth::id(),
            'action_type'   => $actionType,
            'entity_type'   => $entityType,
            'entity_id'     => $entityId,
            'payload'       => $payload,
            'ip_address'    => Request::ip(),
            'status'        => $status,
            'error_message' => $errorMessage,
            'created_at'    => now(),
        ]);
    }
}

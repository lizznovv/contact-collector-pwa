<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class IdempotencyKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->header('Idempotency-Key');

        if (!$key) {
            return $next($request);
        }

        $saved = DB::table('idempotency_keys')
            ->where('key', $key)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if ($saved) {
            return response()->json(
                json_decode($saved->response_body, true),
                $saved->response_status
            );
        }

        $response = $next($request);

        if ($response->getStatusCode() < 400) {
            DB::table('idempotency_keys')->insert([
                'key'             => $key,
                'route'           => $request->path(),
                'response_body'   => $response->getContent(),
                'response_status' => $response->getStatusCode(),
                'expires_at'      => Carbon::now()->addHours(24),
                'created_at'      => Carbon::now(),
                'updated_at'      => Carbon::now(),
            ]);
        }


        return $response;
    }
}

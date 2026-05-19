<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ... $roles)
    {
        $user = auth()->user();
        if (!$user)
        {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        foreach ($roles as $role)
        {
            if ($user->role === $role)
            {
                return $next($request);
            }
        }

        return response()->json([
            'message' => 'Forbidden'
        ], 403);
    }
}

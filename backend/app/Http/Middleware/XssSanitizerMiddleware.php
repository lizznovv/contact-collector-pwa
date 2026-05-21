<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Mews\Purifier\Facades\Purifier;
use Symfony\Component\HttpFoundation\Response;

class XssSanitizerMiddleware
{
    private array $excludedFields = [
        'password',
        'token',
        'refresh_token',
    ];
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $clean = $this->cleanArray($request->all());
        $request->merge($clean);

        return $next($request);
    }

    private function cleanArray(array $data): array
    {
        foreach ($data as $key => $value)
        {
            if (in_array($key, $this->excludedFields)) continue;

            if(is_array($value))
            {
                $data[$key] = $this->cleanArray($value);
            }
            elseif(is_string($value))
            {
                $data[$key] = Purifier::clean($value);
            }
        }

        return $data;
    }
}

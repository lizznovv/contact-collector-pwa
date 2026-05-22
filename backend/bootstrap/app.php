<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'xss.protect' => \App\Http\Middleware\XssSanitizerMiddleware::class,
        ]);

        $middleware->redirectGuestsTo(function (){
            return null;
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (AuthenticationException $e, Request $request)
        {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Unauthenticated.'
                ], 401);
            }
        });
        $exceptions->render(function (NotFoundHttpException $e, Request $request)
        {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Resource not found.'
                ], 404);
            }
        });
        $exceptions->render(function(TokenExpiredException $e, Request $request)
        {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Token expired.'
                ], 401);
            }
        });
        $exceptions->render(function(TooManyRequestsHttpException $e, Request $request)
        {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Too many requests.'
                ], 429);
            }
        });

    })->create();

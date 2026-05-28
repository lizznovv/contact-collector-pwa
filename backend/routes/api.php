<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SyncController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;

Route::post('/login', [UserController::class, 'login'])
    ->middleware('throttle:auth');

Route::post('/refresh', [UserController::class, 'refresh']);
Route::get('/health', [HealthController::class, 'index']);

Route::middleware(['auth:api', 'throttle:global', 'xss.protect'])->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [UserController::class, 'logout']);

    Route::middleware('role:admin,manager')->group(function () {

        Route::prefix('leads')->group(function () {

            Route::get('/', [LeadController::class, 'index']);
            Route::post('/', [LeadController::class, 'store'])->middleware('idempotency');
            Route::get('/{id}', [LeadController::class, 'show']);
            Route::put('/{id}', [LeadController::class, 'update']);
            Route::delete('/{id}', [LeadController::class, 'destroy']);
        });

        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{id}', [ProductController::class, 'show']);

        Route::get('/events', [EventController::class, 'index']);
        Route::get('/events/{id}', [EventController::class, 'show']);

        Route::post('/sync', [SyncController::class, 'sync'])->middleware('idempotency');

        Route::middleware('role:admin')->group(function () {

            Route::prefix('managers')->group(function () {

                Route::get('/', [ManagerController::class, 'index']);
                Route::post('/', [ManagerController::class, 'store']);
                Route::get('/{id}', [ManagerController::class, 'show']);
                Route::put('/{id}', [ManagerController::class, 'update']);
                Route::delete('/{id}', [ManagerController::class, 'destroy']);
            });

            Route::prefix('events')->group(function () {
                Route::post('/', [EventController::class, 'store'])->middleware('idempotency');
                Route::put('/{id}', [EventController::class, 'update']);
                Route::delete('/{id}', [EventController::class, 'destroy']);
            });

            Route::prefix('products')->group(function () {
                Route::post('/', [ProductController::class, 'store'])->middleware('idempotency');
                Route::put('/{id}', [ProductController::class, 'update']);
                Route::delete('/{id}', [ProductController::class, 'destroy']);
            });

            Route::prefix('audit-logs')->group(function () {
                Route::get('/',     [AuditLogController::class, 'index']);
                Route::get('/{id}', [AuditLogController::class, 'show']);
            });

            Route::get('/export/leads', [ExportController::class, 'leads']);
        });
    });

});


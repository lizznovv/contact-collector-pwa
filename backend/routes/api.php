<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;

Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::middleware('role:admin,manager')->group(function () {

        Route::prefix('leads')->group(function () {

            Route::get('/', [LeadController::class, 'index']);
            Route::post('/', [LeadController::class, 'store']);
            Route::get('/{id}', [LeadController::class, 'show']);
            Route::put('/{id}', [LeadController::class, 'update']);
            Route::delete('/{id}', [LeadController::class, 'destroy']);
        });

        Route::middleware('role:admin')->group(function () {

            Route::prefix('managers')->group(function () {

                Route::get('/', [ManagerController::class, 'index']);
                Route::post('/', [ManagerController::class, 'store']);
                Route::get('/{id}', [ManagerController::class, 'show']);
                Route::put('/{id}', [ManagerController::class, 'update']);
                Route::delete('/{id}', [ManagerController::class, 'destroy']);
            });
        });
    });

    Route::post('/logout', [UserController::class, 'logout']);

});


<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\UserController;



Route::get('/', function () {
    if (Auth::user()) {
        return redirect()->route('home');
    } else {
        return redirect('login');
    }
});

Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return view('login');
    })->name('login');

    Route::post('/login', [UserController::class, 'login'])->name('login');
});

Route::middleware('auth')->group(function () {

    Route::middleware('role:manager,admin')->group(function () {
        Route::get('/leads/index', [LeadController::class, 'index'])->name('leads.index');
        Route::get('/leads/create', [LeadController::class, 'create'])->name('leads.create');
        Route::post('/leads/store', [LeadController::class, 'store'])->name('leads.store');
        Route::get('/leads/{id}/edit', [LeadController::class, 'edit'])->name('leads.edit');
        Route::put('/leads/{id}/update', [LeadController::class, 'update'])->name('leads.update');
        Route::delete('/leads/{id}/destroy', [LeadController::class, 'destroy'])->name('leads.destroy');
        Route::get('/leads/{id}/show', [LeadController::class, 'show'])->name('leads.show');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/managers/index', [ManagerController::class, 'index'])->name('managers.index');
        Route::get('/managers/create', [ManagerController::class, 'create'])->name('managers.create');
        Route::post('/managers/store', [ManagerController::class, 'store'])->name('managers.store');
        Route::get('/managers/{id}/edit', [ManagerController::class, 'edit'])->name('managers.edit');
        Route::put('/managers/{id}/update', [ManagerController::class, 'update'])->name('managers.update');
        Route::delete('/managers/{id}/destroy', [ManagerController::class, 'destroy'])->name('managers.destroy');
        Route::get('/managers/{id}/show', [ManagerController::class, 'show'])->name('managers.show');
    });

    Route::post('/logout', [UserController::class, 'logout'])->name('logout');

});

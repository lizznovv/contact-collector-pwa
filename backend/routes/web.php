<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeadController;


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

    Route::middleware('role:manager')->group(function () {
        Route::get('/leads/index', [LeadController::class, 'index'])->name('leads.index');
        Route::get('/leads/create', [LeadController::class, 'create'])->name('leads.create');
        Route::post('/leads/store', [LeadController::class, 'store'])->name('leads.store');
        Route::get('/leads/{id}/edit', [LeadController::class, 'edit'])->name('leads.edit');
        Route::put('/leads/{id}/update', [LeadController::class, 'update'])->name('leads.update');
        Route::delete('/leads/{id}/destroy', [LeadController::class, 'destroy'])->name('leads.destroy');
        Route::get('/leads/{id}/show', [LeadController::class, 'show'])->name('leads.show');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('manager/form/{user?}', [ManagerController::class, 'formManager'])->name('form_manager');
        Route::post('manager/create', [ManagerController::class, 'createManager'])->name('add_manager');
        Route::put('manager/{id}/update', [ManagerController::class, 'updateManager'])->name('update_manager');
        Route::get('manager/list', [ManagerController::class, 'listManager'])->name('list_manager');
        Route::post('manager/{user}/status', [ManagerController::class, 'blockStatusManager'])->name('block_status_manager');
        Route::get('manager/{user}/resetPassword', [ManagerController::class, 'resetPasswordManager'])->name('reset_password');
    });

    Route::get('/logout', [UserController::class, 'logout'])->name('logout');

});

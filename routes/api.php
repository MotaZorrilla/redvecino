<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CondoFinanceController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\TicketCategoryController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn($r) => $r->user());

    // 1. Users Management (Protected: manage users)
    Route::middleware('can:manage users')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole']);
    });

    // 2. Properties Management
    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/{id}', [PropertyController::class, 'show']);
    Route::middleware('can:configure system')->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
    });

    // 3. Finances
    Route::middleware('can:view financial reports')->group(function () {
        Route::get('/expenses', [ExpenseController::class, 'index']);
        Route::get('/fines', [FineController::class, 'index']);
    });
    
    Route::middleware('can:approve expenses')->group(function () {
        Route::post('/expenses', [ExpenseController::class, 'store']);
        Route::post('/fines', [FineController::class, 'store']);
        Route::put('/payments/{id}/reconcile', [PaymentController::class, 'reconcile']);
    });

    // Condo Finances (Ingresos y Egresos)
    Route::middleware('can:view financial reports')->group(function () {
        Route::get('/condo-finances/summary', [CondoFinanceController::class, 'summary']);
        Route::get('/condo-finances/incomes', [CondoFinanceController::class, 'indexIncomes']);
        Route::get('/condo-finances/expenses', [CondoFinanceController::class, 'indexExpenses']);
    });

    Route::middleware('can:approve expenses')->group(function () {
        Route::post('/condo-finances/incomes', [CondoFinanceController::class, 'storeIncome']);
        Route::put('/condo-finances/incomes/{id}', [CondoFinanceController::class, 'updateIncome']);
        Route::delete('/condo-finances/incomes/{id}', [CondoFinanceController::class, 'destroyIncome']);
        Route::post('/condo-finances/expenses', [CondoFinanceController::class, 'storeExpense']);
        Route::put('/condo-finances/expenses/{id}', [CondoFinanceController::class, 'updateExpense']);
        Route::delete('/condo-finances/expenses/{id}', [CondoFinanceController::class, 'destroyExpense']);
    });

    Route::middleware('can:pay common expenses')->group(function () {
        Route::post('/payments', [PaymentController::class, 'store']);
    });

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/account-statement/{user_id}', [PaymentController::class, 'accountStatement']);

    // 4. Tickets
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::get('/ticket-categories', [TicketCategoryController::class, 'index']);

    Route::middleware('can:create tickets')->group(function () {
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::post('/ticket-categories', [TicketCategoryController::class, 'store']);
    });

    Route::middleware('can:assign tickets')->group(function () {
        Route::put('/tickets/{id}/assign', [TicketController::class, 'assign']);
    });

    Route::middleware('can:resolve tickets')->group(function () {
        Route::put('/tickets/{id}/resolve', [TicketController::class, 'resolve']);
        Route::put('/tickets/{id}', [TicketController::class, 'update']);
    });

    // 5. Communications
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::middleware('can:publish announcements')->group(function () {
        Route::post('/announcements', [AnnouncementController::class, 'store']);
    });

    // 6. Direct Messages
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);
});

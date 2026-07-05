<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\CondoFinanceController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\HRController;
use App\Http\Controllers\PersonWizardController;
use App\Http\Controllers\CommonExpenseController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\TicketCategoryController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TiCommandController;
use App\Http\Controllers\TiPermissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoadmapFeaturesController;
use App\Http\Controllers\CondominiumController;
use App\Http\Controllers\CondominiumSetupController;
use Illuminate\Support\Facades\Route;

Route::post('/login-pin', [RoadmapFeaturesController::class, 'loginPin']);

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::get('/user', fn(Request $r) => $r->user());

    // 1. Users Management
    Route::middleware('can:manage users')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole']);
    });

    // Person Wizard
    Route::middleware('can:manage users')->group(function () {
        Route::post('/person-wizard', [PersonWizardController::class, 'store']);
    });

    // Facilities
    Route::get('/facilities', [FacilityController::class, 'index']);
    Route::get('/facilities/{facility}', [FacilityController::class, 'show']);
    Route::middleware('can:manage users')->group(function () {
        Route::post('/facilities', [FacilityController::class, 'store']);
        Route::put('/facilities/{facility}', [FacilityController::class, 'update']);
        Route::delete('/facilities/{facility}', [FacilityController::class, 'destroy']);
        Route::get('/hr/employees', [HRController::class, 'employees']);
        Route::get('/hr/employees/{id}', [HRController::class, 'showEmployee']);
        Route::post('/hr/employees', [HRController::class, 'saveEmployee']);
        Route::put('/hr/employees/{id}', [HRController::class, 'updateEmployee']);
        Route::delete('/hr/employees/{id}', [HRController::class, 'deleteEmployee']);
        Route::get('/hr/liquidations', [HRController::class, 'listLiquidations']);
        Route::get('/hr/liquidations/{id}', [HRController::class, 'showLiquidation']);
        Route::post('/hr/liquidations', [HRController::class, 'saveLiquidation']);
        Route::put('/hr/liquidations/{id}', [HRController::class, 'updateLiquidation']);
        Route::delete('/hr/liquidations/{id}', [HRController::class, 'deleteLiquidation']);
    });
    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/{id}', [PropertyController::class, 'show']);
    Route::middleware('can:configure system')->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
        
        // Setup Condominium
        Route::post('/setup-condominium', [CondominiumSetupController::class, 'setup']);
        Route::post('/setup-condominium/copy-tower', [CondominiumSetupController::class, 'copyTowerStructure']);
        
        Route::get('/condominiums/{id}', [CondominiumController::class, 'show']);
        Route::put('/condominiums/{id}', [CondominiumController::class, 'update']);
    });

    // 3. Finances
    Route::middleware('can:view financial reports')->group(function () {
        Route::get('/expenses', [ExpenseController::class, 'index']);
        Route::post('/expenses/show/{id}', [ExpenseController::class, 'show']);
        Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
        Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);
        Route::get('/fines', [FineController::class, 'index']);
        Route::get('/fines/{id}', [FineController::class, 'show']);
        Route::put('/fines/{id}', [FineController::class, 'update']);
        Route::delete('/fines/{id}', [FineController::class, 'destroy']);
    });

    Route::middleware('can:approve expenses')->group(function () {
        Route::post('/expenses', [ExpenseController::class, 'store']);
        Route::post('/fines', [FineController::class, 'store']);
        Route::put('/payments/{id}/reconcile', [PaymentController::class, 'reconcile']);
    });

    // Condo Finances
    Route::middleware('can:view financial reports')->group(function () {
        Route::get('/condo-finances/catalog', [CondoFinanceController::class, 'catalog']);
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
        
        Route::post('/common-expenses/generate', [CommonExpenseController::class, 'generatePeriod']);
        Route::post('/common-expenses/publish', [CommonExpenseController::class, 'publishPeriod']);
    });

    Route::middleware('can:pay common expenses')->group(function () {
        Route::post('/payments', [PaymentController::class, 'store']);
    });

    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/users/{user_id}/account-statement', [PaymentController::class, 'accountStatement']);

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

    // 7. DevOps TI Commands (rate limited separately)
    Route::prefix('ti')->middleware(['throttle:30,1', 'can:view logs'])->group(function () {
        Route::post('/command', [TiCommandController::class, 'execute']);
        Route::get('/roles-permissions', [TiPermissionController::class, 'index']);
        Route::post('/roles-permissions/toggle', [TiPermissionController::class, 'toggle']);
    });

    // 8. Roadmap Features
    Route::get('/bookings', [RoadmapFeaturesController::class, 'listBookings']);
    Route::post('/bookings', [RoadmapFeaturesController::class, 'storeBooking']);
    Route::post('/qr-invitations', [RoadmapFeaturesController::class, 'storeQrInvitation']);
    Route::post('/qr-invitations/verify', [RoadmapFeaturesController::class, 'verifyQrInvitation']);
    Route::post('/package-custodies', [RoadmapFeaturesController::class, 'storePackageCustody']);
    Route::put('/package-custodies/{id}/deliver', [RoadmapFeaturesController::class, 'deliverPackageCustody']);
    Route::post('/quorum-calculation', [RoadmapFeaturesController::class, 'calculateQuorum']);
    Route::post('/funds/transfer', [RoadmapFeaturesController::class, 'transferFunds']);
});


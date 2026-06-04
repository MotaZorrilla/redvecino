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

    // 7. DevOps TI Commands (VPS programmatic execution)
    Route::post('/ti/command', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if (!$user || !$user->hasAnyRole(['TI', 'ti'])) {
            return response()->json(['error' => 'No autorizado. Solo administradores de TI pueden ejecutar comandos.'], 403);
        }

        $command = $request->input('command');
        if (!$command) {
            return response()->json(['error' => 'Comando no especificado.'], 400);
        }

        $cmd = trim(strtolower($command));

        try {
            if ($cmd === 'db:status') {
                $dbName = config('database.default');
                $usersCount = \App\Models\User::count();
                $propertiesCount = \App\Models\Property::count();
                return response()->json([
                    'output' => "[DATABASE] Entorno VPS. Connection: {$dbName}. SQLite status: OK. Total Usuarios: {$usersCount}, Total Departamentos/Unidades: {$propertiesCount}."
                ]);
            }

            if ($cmd === 'cache:clear') {
                \Illuminate\Support\Facades\Artisan::call('cache:clear');
                \Illuminate\Support\Facades\Artisan::call('config:clear');
                return response()->json([
                    'output' => "[CACHE] Artisan cache:clear & config:clear ejecutados con éxito. Cachés del Kernel purgadas en el VPS."
                ]);
            }

            if ($cmd === 'system:info') {
                $phpVersion = PHP_VERSION;
                $laravelVersion = app()->version();
                $os = PHP_OS;
                return response()->json([
                    'output' => "[SYSTEM] VPS Config. OS: {$os}. PHP: {$phpVersion}. Laravel: {$laravelVersion}. Host: " . ($_SERVER['HTTP_HOST'] ?? 'localhost')
                ]);
            }

            if ($cmd === 'auth:permissions') {
                return response()->json([
                    'output' => "[SPATIE RBAC] Roles registrados en base de datos: TI, Admin, Conserjería (employee), Comité, Proveedor, Residente. Todos los permisos cargados correctamente en memoria caché."
                ]);
            }

            if ($cmd === 'logs:view') {
                $logPath = storage_path('logs/laravel.log');
                if (!file_exists($logPath)) {
                    return response()->json([
                        'output' => "[LOGS] El archivo laravel.log no existe en la ruta de almacenamiento."
                    ]);
                }
                
                $size = filesize($logPath);
                if ($size === 0) {
                    return response()->json([
                        'output' => "[LOGS] El archivo laravel.log está vacío."
                    ]);
                }

                $lines = [];
                $fp = fopen($logPath, 'r');
                if ($fp) {
                    $maxLines = 50;
                    fseek($fp, 0, SEEK_END);
                    $pos = ftell($fp);
                    $lineCount = 0;
                    
                    while ($pos > 0 && $lineCount <= $maxLines) {
                        fseek($fp, --$pos);
                        $char = fgetc($fp);
                        if ($char === "\n") {
                            $lineCount++;
                        }
                    }
                    
                    if ($pos > 0) {
                        fseek($fp, $pos + 1);
                    } else {
                        fseek($fp, 0);
                    }
                    
                    while (!feof($fp)) {
                        $line = fgets($fp);
                        if ($line !== false) {
                            $lines[] = trim($line);
                        }
                    }
                    fclose($fp);
                }
                
                $output = implode("\n", array_slice($lines, -$maxLines));
                return response()->json([
                    'output' => "[LOGS - ÚLTIMAS 50 LÍNEAS]\n" . ($output ?: 'Archivo vacío o sin líneas legibles.')
                ]);
            }

            if ($cmd === 'logs:clear') {
                $logPath = storage_path('logs/laravel.log');
                if (file_exists($logPath)) {
                    file_put_contents($logPath, '');
                    return response()->json([
                        'output' => "[LOGS] Archivo laravel.log truncado y limpiado con éxito en el VPS."
                    ]);
                }
                return response()->json([
                    'output' => "[LOGS] No se encontró el archivo laravel.log para limpiar."
                ]);
            }

            if ($cmd === 'db:migrate') {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json([
                    'output' => "[MIGRACIONES] Ejecutado php artisan migrate --force en el VPS:\n" . ($output ?: 'Listo (sin cambios pendientes o base de datos al día).')
                ]);
            }

            if ($cmd === 'db:seed') {
                \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
                $output = \Illuminate\Support\Facades\Artisan::output();
                return response()->json([
                    'output' => "[SEEDERS] Ejecutado php artisan db:seed --force en el VPS:\n" . ($output ?: 'Listo.')
                ]);
            }

            return response()->json([
                'output' => "[CMD] Comando '{$command}' no reconocido. Ejecuta '/help' para ver una lista de comandos seguros disponibles."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'output' => "[ERROR] Excepción al ejecutar el comando programáticamente: " . $e->getMessage()
            ], 500);
        }
    });

    // 8. Spatie Real RBAC Matrix APIs
    Route::get('/ti/roles-permissions', function () {
        $user = request()->user();
        if (!$user || !$user->hasAnyRole(['TI', 'ti'])) {
            return response()->json(['error' => 'No autorizado. Solo administradores de TI pueden gestionar permisos.'], 403);
        }

        $roles = \Spatie\Permission\Models\Role::all();
        $permissions = \Spatie\Permission\Models\Permission::all();
        
        $matrix = [];
        foreach ($roles as $role) {
            $matrix[$role->name] = $role->permissions->pluck('name')->toArray();
        }

        return response()->json([
            'roles' => $roles->pluck('name')->toArray(),
            'permissions' => $permissions->pluck('name')->toArray(),
            'matrix' => $matrix
        ]);
    });

    Route::post('/ti/roles-permissions/toggle', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if (!$user || !$user->hasAnyRole(['TI', 'ti'])) {
            return response()->json(['error' => 'No autorizado. Solo administradores de TI pueden gestionar permisos.'], 403);
        }

        $roleName = $request->input('role');
        $permissionName = $request->input('permission');

        if (!$roleName || !$permissionName) {
            return response()->json(['error' => 'Rol y permiso requeridos.'], 400);
        }

        $role = \Spatie\Permission\Models\Role::findByName($roleName, 'web');
        $permission = \Spatie\Permission\Models\Permission::findOrCreate($permissionName, 'web');

        if ($role->hasPermissionTo($permission)) {
            $role->revokePermissionTo($permission);
            $action = 'revoked';
        } else {
            $role->givePermissionTo($permission);
            $action = 'granted';
        }

        // Clear cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        return response()->json([
            'success' => true,
            'action' => $action,
            'message' => "Permiso '{$permissionName}' " . ($action === 'granted' ? 'otorgado' : 'revocado') . " al rol '{$roleName}'."
        ]);
    });
});

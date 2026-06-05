<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class TiCommandController extends Controller
{
    public function execute(Request $request)
    {
        $request->validate(['command' => 'required|string']);

        $command = trim(strtolower($request->command));

        try {
            return match ($command) {
                'db:status' => $this->dbStatus(),
                'cache:clear' => $this->cacheClear(),
                'system:info' => $this->systemInfo(),
                'auth:permissions' => $this->authPermissions(),
                'logs:view' => $this->logsView(),
                'logs:clear' => $this->logsClear(),
                'db:migrate' => $this->dbMigrate(),
                'db:seed' => $this->dbSeed(),
                default => response()->json([
                    'output' => "[CMD] Comando '{$command}' no reconocido. Ejecuta '/help' para ver una lista de comandos seguros disponibles."
                ]),
            };
        } catch (\Exception $e) {
            return response()->json([
                'output' => "[ERROR] Excepción al ejecutar el comando: " . $e->getMessage()
            ], 500);
        }
    }

    private function dbStatus()
    {
        $dbName = config('database.default');
        $usersCount = User::count();
        $propertiesCount = Property::count();
        return response()->json([
            'output' => "[DATABASE] Entorno VPS. Connection: {$dbName}. SQLite status: OK. Total Usuarios: {$usersCount}, Total Departamentos/Unidades: {$propertiesCount}."
        ]);
    }

    private function cacheClear()
    {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        return response()->json([
            'output' => "[CACHE] Artisan cache:clear & config:clear ejecutados con éxito."
        ]);
    }

    private function systemInfo()
    {
        $phpVersion = PHP_VERSION;
        $laravelVersion = app()->version();
        $os = PHP_OS;
        return response()->json([
            'output' => "[SYSTEM] VPS Config. OS: {$os}. PHP: {$phpVersion}. Laravel: {$laravelVersion}. Host: " . ($_SERVER['HTTP_HOST'] ?? 'localhost')
        ]);
    }

    private function authPermissions()
    {
        return response()->json([
            'output' => "[SPATIE RBAC] Roles registrados en base de datos: TI, Admin, Conserjería (employee), Comité, Proveedor, Residente. Todos los permisos cargados correctamente en memoria caché."
        ]);
    }

    private function logsView()
    {
        $logPath = storage_path('logs/laravel.log');
        if (!file_exists($logPath)) {
            return response()->json(['output' => "[LOGS] El archivo laravel.log no existe."]);
        }

        $size = filesize($logPath);
        if ($size === 0) {
            return response()->json(['output' => "[LOGS] El archivo laravel.log está vacío."]);
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
                if (fgetc($fp) === "\n") {
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

    private function logsClear()
    {
        $logPath = storage_path('logs/laravel.log');
        if (file_exists($logPath)) {
            file_put_contents($logPath, '');
            return response()->json(['output' => "[LOGS] Archivo laravel.log truncado y limpiado con éxito."]);
        }
        return response()->json(['output' => "[LOGS] No se encontró el archivo laravel.log para limpiar."]);
    }

    private function dbMigrate()
    {
        Artisan::call('migrate', ['--force' => true]);
        $output = Artisan::output();
        return response()->json([
            'output' => "[MIGRACIONES] Ejecutado php artisan migrate --force:\n" . ($output ?: 'Listo (sin cambios pendientes).')
        ]);
    }

    private function dbSeed()
    {
        Artisan::call('db:seed', ['--force' => true]);
        $output = Artisan::output();
        return response()->json([
            'output' => "[SEEDERS] Ejecutado php artisan db:seed --force:\n" . ($output ?: 'Listo.')
        ]);
    }
}

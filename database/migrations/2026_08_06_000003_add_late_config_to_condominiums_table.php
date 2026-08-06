<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Configuración paramétrica de mora en condominiums:
     *   - due_day: día del mes de vencimiento del gasto común.
     *   - late_interest_rate: tasa de interés mensual de mora (%).
     * Los motores contables deben leer estos valores (antes hardcodeados en 1.5%).
     */
    public function up(): void
    {
        Schema::table('condominiums', function (Blueprint $table) {
            // Día de vencimiento: default 10 (legacy). Tasa de mora: nullable;
            // si es null los motores caen al 1.5% histórico (preserva contractos de prueba).
            $table->unsignedTinyInteger('due_day')->default(10)->after('status');
            $table->decimal('late_interest_rate', 5, 2)->nullable()->after('due_day');
        });
    }

    public function down(): void
    {
        Schema::table('condominiums', function (Blueprint $table) {
            $table->dropColumn(['late_interest_rate', 'due_day']);
        });
    }
};
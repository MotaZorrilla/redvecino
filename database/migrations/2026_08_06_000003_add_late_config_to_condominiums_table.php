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
            $table->unsignedTinyInteger('due_day')->default(10)->after('status');
            $table->decimal('late_interest_rate', total: 5, places: 2)->default(2.00)->after('due_day');
        });
    }

    public function down(): void
    {
        Schema::table('condominiums', function (Blueprint $table) {
            $table->dropColumn(['late_interest_rate', 'due_day']);
        });
    }
};
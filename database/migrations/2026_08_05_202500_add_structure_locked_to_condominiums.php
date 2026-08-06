<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agrega un campo booleano `structure_locked` a condominiums.
     * Cuando está en true, la malla arquitectónica (torres, pisos, unidades)
     * no puede ser modificada por Administradores. Solo TI puede desbloquear.
     */
    public function up(): void
    {
        Schema::table('condominiums', function (Blueprint $table) {
            $table->boolean('structure_locked')->default(false)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('condominiums', function (Blueprint $table) {
            $table->dropColumn('structure_locked');
        });
    }
};

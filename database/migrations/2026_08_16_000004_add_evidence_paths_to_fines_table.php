<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Añadir soporte para hasta 3 fotos de evidencia fotográfica en multas.
     */
    public function up(): void
    {
        Schema::table('fines', function (Blueprint $table) {
            $table->json('evidence_paths')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('fines', function (Blueprint $table) {
            $table->dropColumn('evidence_paths');
        });
    }
};

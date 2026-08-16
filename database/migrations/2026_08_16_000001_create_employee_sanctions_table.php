<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Amonestaciones y Llamados de Atención a Colaboradores.
     * Trazabilidad laboral y disciplinaria con respaldo documental.
     */
    public function up(): void
    {
        Schema::create('employee_sanctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->cascadeOnDelete();
            $table->foreignId('employee_profile_id')->constrained('employee_profiles')->cascadeOnDelete();
            $table->date('date');
            $table->time('time')->nullable();
            $table->string('reason'); // Motivo / Infracción (ej. Atraso reiterado, Falta de respeto, Abandono de puesto)
            $table->text('description');
            $table->string('document_path')->nullable(); // Ruta a archivo PDF o fotografía de respaldo
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_sanctions');
    }
};

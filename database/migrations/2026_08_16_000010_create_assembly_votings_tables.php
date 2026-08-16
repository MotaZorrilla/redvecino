<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Motor de Asambleas y Votaciones por Unidad (Ley 21.442).
     * 1 Voto por departamento ponderado por el coeficiente de alícuota legal.
     */
    public function up(): void
    {
        Schema::create('assembly_votings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->float('quorum_required_percent')->default(50.0);
            $table->string('status')->default('open'); // open, closed
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });

        Schema::create('assembly_voting_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assembly_voting_id')->constrained('assembly_votings')->cascadeOnDelete();
            $table->string('title'); // Aprobado, Rechazado, Opción 1, etc.
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('assembly_unit_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assembly_voting_id')->constrained('assembly_votings')->cascadeOnDelete();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('assembly_voting_option_id')->constrained('assembly_voting_options')->cascadeOnDelete();
            $table->float('coefficient_weight')->default(0.0);
            $table->timestamps();

            // Garantía legal estricta: 1 solo voto por unidad
            $table->unique(['assembly_voting_id', 'property_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assembly_unit_votes');
        Schema::dropIfExists('assembly_voting_options');
        Schema::dropIfExists('assembly_votings');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ficha de Unidad (unit_profiles) + Integrantes (unit_members).
     * Da soporte real a la UI "Ficha de Residentes" (UsersList).
     */
    public function up(): void
    {
        Schema::create('unit_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->unique()->constrained('properties')->cascadeOnDelete();
            $table->string('parking_spot')->nullable();
            $table->string('license_plate', 10)->nullable();
            $table->text('observation')->nullable();
            $table->timestamps();
        });

        Schema::create('unit_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_profile_id')->constrained('unit_profiles')->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('rut', 12);
            $table->date('birth_date');
            $table->boolean('is_owner')->default(false);
            $table->boolean('lives_in_unit')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_members');
        Schema::dropIfExists('unit_profiles');
    }
};
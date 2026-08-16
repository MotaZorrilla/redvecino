<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Gestión de Unidades, Estacionamientos Múltiples, Bodegas
     * y Registro Sanitario de Mascotas (Ley Chilena de Copropiedad).
     */
    public function up(): void
    {
        Schema::table('unit_profiles', function (Blueprint $table) {
            $table->json('parking_spots')->nullable();
            $table->json('storage_units')->nullable();
        });

        Schema::create('unit_pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->string('name');
            $table->string('species')->default('perro'); // perro, gato, ave, otro
            $table->string('breed')->nullable();
            $table->string('chip_number', 20)->nullable(); // Microchip de 15 dígitos oficial
            $table->string('medical_record_path')->nullable(); // PDF o foto del carnet sanitario / vacunas
            $table->boolean('is_vaccinated')->default(true);
            $table->date('last_vaccine_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_pets');

        Schema::table('unit_profiles', function (Blueprint $table) {
            $table->dropColumn(['parking_spots', 'storage_units']);
        });
    }
};

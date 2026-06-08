<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create condo_towers table
        Schema::create('condo_towers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->cascadeOnDelete();
            $table->string('name');
            $table->boolean('has_water_meter')->default(false);
            $table->boolean('has_electricity_meter')->default(false);
            $table->timestamps();
        });

        // 2. Alter properties table
        Schema::table('properties', function (Blueprint $table) {
            $table->foreignId('tower_id')->nullable()->constrained('condo_towers')->nullOnDelete();
        });

        // 3. Alter condo_expenses table
        Schema::table('condo_expenses', function (Blueprint $table) {
            $table->string('distributable_method')->default('prorated'); // prorated, equal, tower_specific, unit_specific, exempt
            $table->foreignId('tower_id')->nullable()->constrained('condo_towers')->nullOnDelete();
        });

        // 4. Alter condo_incomes table
        Schema::table('condo_incomes', function (Blueprint $table) {
            $table->string('distributable_method')->default('prorated'); // prorated, equal, tower_specific, unit_specific, exempt
            $table->foreignId('tower_id')->nullable()->constrained('condo_towers')->nullOnDelete();
        });

        // 5. Create afps table
        Schema::create('afps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('commission_rate', 5, 2); // e.g. 10.00, 11.44
            $table->timestamps();
        });

        // 6. Alter employee_profiles table
        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->foreignId('afp_id')->nullable()->constrained('afps')->nullOnDelete();
            $table->string('bank_name')->nullable();
            $table->string('account_type')->nullable();
            $table->string('account_number')->nullable();
            $table->string('payment_method')->nullable();
        });

        // 7. Create liquidations table
        Schema::create('liquidations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_profile_id')->constrained('employee_profiles')->cascadeOnDelete();
            $table->string('period'); // e.g., "2025-05"
            $table->string('liquidation_number')->nullable()->unique();
            
            // Haberes Imponibles
            $table->decimal('sueldo_base', 10, 2);
            $table->decimal('asignacion_responsabilidad', 10, 2)->default(0);
            $table->decimal('horas_extras', 10, 2)->default(0);
            $table->decimal('total_imponibles', 10, 2);
            
            // Haberes No Imponibles
            $table->decimal('asignacion_colacion', 10, 2)->default(0);
            $table->decimal('asignacion_movilizacion', 10, 2)->default(0);
            $table->decimal('asignacion_vestuario', 10, 2)->default(0);
            $table->decimal('total_no_imponibles', 10, 2);
            
            // Descuentos Previsionales
            $table->decimal('salud_fonasa', 10, 2);
            $table->foreignId('afp_id')->nullable()->constrained('afps')->nullOnDelete();
            $table->decimal('afp_monto', 10, 2);
            $table->decimal('afp_rate', 5, 2);
            $table->decimal('seguro_cesantia', 10, 2);
            $table->decimal('total_previsionales', 10, 2);
            
            // Otros Descuentos
            $table->decimal('anticipo', 10, 2)->default(0);
            $table->decimal('prestamo', 10, 2)->default(0);
            $table->decimal('multas_atrasos', 10, 2)->default(0);
            $table->decimal('total_otros_descuentos', 10, 2);
            
            // Resultado
            $table->decimal('sueldo_liquido', 10, 2);
            
            // Pago info
            $table->string('bank_name')->nullable();
            $table->string('account_type')->nullable();
            $table->string('account_number')->nullable();
            $table->date('payment_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->text('observations')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('liquidations');

        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->dropForeign(['afp_id']);
            $table->dropColumn(['afp_id', 'bank_name', 'account_type', 'account_number', 'payment_method']);
        });

        Schema::dropIfExists('afps');

        Schema::table('condo_incomes', function (Blueprint $table) {
            $table->dropForeign(['tower_id']);
            $table->dropColumn(['distributable_method', 'tower_id']);
        });

        Schema::table('condo_expenses', function (Blueprint $table) {
            $table->dropForeign(['tower_id']);
            $table->dropColumn(['distributable_method', 'tower_id']);
        });

        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['tower_id']);
            $table->dropColumn(['tower_id']);
        });

        Schema::dropIfExists('condo_towers');
    }
};

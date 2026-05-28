<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('condo_incomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->cascadeOnDelete();
            $table->string('category'); // multas, gastos_comunes, arriendo_espacios, intereses_mora, cuotas_extraordinarias, publicidad_convenio, otro
            $table->string('subcategory')->nullable();
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->text('description')->nullable();
            $table->foreignId('property_id')->nullable()->constrained('properties')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('condo_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->cascadeOnDelete();
            $table->string('category'); // personal, mantencion, servicios_basicos, seguridad, administracion, otro
            $table->string('subcategory')->nullable();
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->text('description')->nullable();
            $table->foreignId('property_id')->nullable()->constrained('properties')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('common_expense_id')->nullable()->constrained('common_expenses')->nullOnDelete();
            $table->foreignId('expense_item_id')->nullable()->constrained('expense_items')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('condo_expenses');
        Schema::dropIfExists('condo_incomes');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tablas para el Motor Contable de Gastos Comunes (Fase 2):
     * 1. `common_expense_periods`: Períodos contables mensuales (ej: 2026-08)
     * 2. `common_expense_receipts`: Boletas/Avisos de cobro por propiedad
     */
    public function up(): void
    {
        Schema::create('common_expense_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->onDelete('cascade');
            $table->string('period', 7); // Format: YYYY-MM (ej. 2026-08)
            $table->enum('status', ['draft', 'issued', 'closed'])->default('draft');
            $table->decimal('total_expenses', 12, 2)->default(0.00);
            $table->decimal('reserve_fund_pct', 5, 2)->default(5.00); // 5.00%
            $table->date('due_date')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['condominium_id', 'period']);
        });

        Schema::create('common_expense_receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')->constrained('common_expense_periods')->onDelete('cascade');
            $table->foreignId('condominium_id')->constrained('condominiums')->onDelete('cascade');
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->decimal('alicuota_pct', 8, 6)->default(0.000000); // Coeficiente (ej. 0.006722)
            $table->decimal('base_amount', 12, 2)->default(0.00); // Gasto Común Base G
            $table->decimal('reserve_fund_amount', 12, 2)->default(0.00); // Fondo de Reserva FR
            $table->decimal('individual_consumption', 12, 2)->default(0.00); // CGE / Agua / Luz C_ind
            $table->decimal('previous_balance', 12, 2)->default(0.00); // Saldo Anterior Pendiente
            $table->decimal('interest_amount', 12, 2)->default(0.00); // Interés por mora
            $table->decimal('total_amount', 12, 2)->default(0.00); // Total Obligación Económica
            $table->date('due_date')->nullable();
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->unique(['period_id', 'property_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('common_expense_receipts');
        Schema::dropIfExists('common_expense_periods');
    }
};

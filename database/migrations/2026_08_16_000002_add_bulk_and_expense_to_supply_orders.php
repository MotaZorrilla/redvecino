<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Enriquecer SupplyOrders con categoría, notas, vinculación a egresos contables
     * y flag allow_supplies en employee_profiles.
     */
    public function up(): void
    {
        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->boolean('allow_supplies')->default(true);
        });

        Schema::table('supply_orders', function (Blueprint $table) {
            $table->string('category')->default('repuesto');
            $table->text('notes')->nullable();
            $table->foreignId('condo_expense_id')->nullable()->constrained('condo_expenses')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('supply_orders', function (Blueprint $table) {
            $table->dropForeign(['condo_expense_id']);
            $table->dropColumn(['category', 'notes', 'condo_expense_id']);
        });

        Schema::table('employee_profiles', function (Blueprint $table) {
            $table->dropColumn(['allow_supplies']);
        });
    }
};

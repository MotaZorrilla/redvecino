<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Protocolo de Inspección y Checklist de Áreas Comunes (Check-in / Check-out).
     * Control de inventario, estado físico, daños y retención de garantías.
     */
    public function up(): void
    {
        Schema::create('facility_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->cascadeOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->string('facility_name'); // Quincho, Sala Multiuso, Terraza, etc.
            $table->string('type')->default('check_in'); // check_in, check_out
            $table->foreignId('inspected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('conforme'); // conforme, con_observaciones, con_danos
            $table->json('items_status')->nullable(); // Desglose de ítems (mobiliario, parrilla, aseo, etc.)
            $table->json('evidence_photos')->nullable(); // Fotos de respaldo
            $table->string('deposit_action')->default('liberar'); // liberar, retener, cobrar_reparacion
            $table->decimal('deposit_deduction_amount', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_checklists');
    }
};

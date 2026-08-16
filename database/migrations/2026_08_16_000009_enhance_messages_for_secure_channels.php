<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Canales de Mensajería Interna Segura (Conserjería, Comité y Administración)
     * con privacidad total de números de WhatsApp / teléfono y vinculación por Unidad.
     */
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->foreignId('condominium_id')->nullable()->constrained('condominiums')->cascadeOnDelete();
            $table->foreignId('property_id')->nullable()->constrained('properties')->nullOnDelete();
            $table->string('channel_type')->default('conserjeria_unidad'); // conserjeria_unidad, comite_privado, administracion_oficial, directo
            $table->string('attachment_path')->nullable();
            $table->string('subject')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['condominium_id']);
            $table->dropForeign(['property_id']);
            $table->dropColumn(['condominium_id', 'property_id', 'channel_type', 'attachment_path']);
        });
    }
};

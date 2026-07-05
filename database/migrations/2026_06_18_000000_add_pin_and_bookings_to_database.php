<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add PIN to users table for Acceso Preferencial
        Schema::table('users', function (Blueprint $table) {
            $table->string('pin', 4)->nullable()->after('password');
        });

        // 2. Create bookings table for Alertas de Morosidad & Areas Comunes
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->foreignId('condominium_id')->constrained('condominiums')->onDelete('cascade');
            $table->string('area_name');
            $table->date('booking_date');
            $table->string('time_slot');
            $table->string('status')->default('approved');
            $table->timestamps();
        });

        // 3. Create qr_invitations table for Control de Accesos Físicos
        Schema::create('qr_invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('condominium_id')->constrained('condominiums')->onDelete('cascade');
            $table->string('visitor_name');
            $table->string('visitor_rut')->nullable();
            $table->string('code')->unique();
            $table->integer('scanned_count')->default(0);
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        // 4. Create package_custodies table for Front Desk - Conserjería OCR
        Schema::create('package_custodies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('condominium_id')->constrained('condominiums')->onDelete('cascade');
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->string('recipient_name');
            $table->string('carrier')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('status')->default('custody');
            $table->text('signature')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_custodies');
        Schema::dropIfExists('qr_invitations');
        Schema::dropIfExists('bookings');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('pin');
        });
    }
};

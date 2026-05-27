<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('owner_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->decimal('ownership_percentage', 5, 2)->default(100);
            $table->string('financial_status')->default('al_dia');
            $table->timestamps();
        });

        Schema::create('resident_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('resident_type');
            $table->string('relationship')->nullable();
            $table->date('lease_start')->nullable();
            $table->date('lease_end')->nullable();
            $table->timestamps();
        });

        Schema::create('committee_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('position');
            $table->date('period_start');
            $table->date('period_end');
            $table->string('permission_level')->default('read');
            $table->timestamps();
        });

        Schema::create('employee_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('position');
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('contract_type');
            $table->string('shift');
            $table->decimal('salary', 10, 2)->nullable();
            $table->date('hire_date');
            $table->timestamps();
        });

        Schema::create('admin_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('access_level')->default('full');
            $table->timestamps();
        });

        Schema::create('ti_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('access_level')->default('full');
            $table->boolean('system_logs_permission')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ti_profiles');
        Schema::dropIfExists('admin_profiles');
        Schema::dropIfExists('employee_profiles');
        Schema::dropIfExists('committee_profiles');
        Schema::dropIfExists('resident_profiles');
        Schema::dropIfExists('owner_profiles');
    }
};

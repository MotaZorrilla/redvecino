<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('rut')->unique()->nullable()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->string('photo')->nullable()->after('password');
            $table->string('status')->default('active')->after('photo');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['rut', 'phone', 'photo', 'status']);
            $table->dropSoftDeletes();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('package_custodies', function (Blueprint $table) {
            if (!Schema::hasColumn('package_custodies', 'photo_path')) {
                $table->string('photo_path')->nullable();
            }
            if (!Schema::hasColumn('package_custodies', 'notes')) {
                $table->text('notes')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('package_custodies', function (Blueprint $table) {
            if (Schema::hasColumn('package_custodies', 'photo_path')) {
                $table->dropColumn(['photo_path', 'notes']);
            }
        });
    }
};

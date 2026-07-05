<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_catalog', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'income' or 'expense'
            $table->string('category_key');
            $table->string('label');
            $table->json('subcategories');
            $table->timestamps();

            $table->unique(['type', 'category_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_catalog');
    }
};

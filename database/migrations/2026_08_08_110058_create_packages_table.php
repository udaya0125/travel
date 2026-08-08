<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('days');
            $table->string('people');
            $table->string('resort');
            $table->string('price');
            $table->string('emoji');
            $table->foreignId('destination_id')->nullable()->constrained()->nullOnDelete();
            $table->string('category');
            $table->longText('description');
            $table->longText('includes');
            $table->longText('excludes');
            $table->string('slug')->unique()->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

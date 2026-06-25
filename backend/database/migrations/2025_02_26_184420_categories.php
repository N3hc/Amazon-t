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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('id_set');
            $table->string('name');
            $table->date('release_date');
            $table->string('total_cards');
            $table->string('logo');
            $table->string('symbol');
            $table->integer('legal')->default(1); //1 Legal, 0 No legal
            $table->integer('deleted')->default(0); //1 Borrado, 0 Activo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

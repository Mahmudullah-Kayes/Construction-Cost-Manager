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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('name'); // Material name (e.g., Cement, Brick, Sand)
            $table->decimal('quantity', 10, 2); // Quantity with decimal support
            $table->string('unit')->default('kg'); // Unit of measurement (kg, pcs, bag, etc.)
            $table->decimal('price', 12, 2); // Price per unit
            $table->text('note')->nullable(); // Optional notes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};

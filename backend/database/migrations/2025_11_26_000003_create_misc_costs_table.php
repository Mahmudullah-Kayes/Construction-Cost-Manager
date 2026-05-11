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
        Schema::create('misc_costs', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Cost name (e.g., Transportation, Utilities, Miscellaneous)
            $table->decimal('price', 12, 2); // Amount
            $table->text('note')->nullable(); // Optional notes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('misc_costs');
    }
};

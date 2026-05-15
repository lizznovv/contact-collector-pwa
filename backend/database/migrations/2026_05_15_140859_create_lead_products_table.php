<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_products', function (Blueprint $table) {

            $table->foreignId('lead_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('product_id')
                ->constrained()
                ->onDelete('cascade');

            $table->primary(['lead_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_products');
    }
};

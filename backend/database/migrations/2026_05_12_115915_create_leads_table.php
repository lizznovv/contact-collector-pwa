<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('full_name');
            $table->string('phone');
            $table->string('email');

            $table->string('company');
            $table->string('position')->nullable();

            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->string('service');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};

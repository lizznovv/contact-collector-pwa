<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'name',
        'category',
        'is_active',
    ];

    public function leads()
    {
        return $this->belongsToMany(Lead::class);
    }
}

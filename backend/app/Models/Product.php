<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'name',
        'category',
    ];

    public function leads()
    {
        return $this->belongsToMany(Lead::class, 'lead_products');
    }
}

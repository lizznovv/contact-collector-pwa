<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $table = 'leads';

    protected $fillable = [
        'id',
        'user_id',
        'full_name',
        'phone',
        'email',
        'event',
        'product',
        'created_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function event()
    {
        return $this->belongsTo(Events::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}

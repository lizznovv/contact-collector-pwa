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
        'service',
        'status',
        'created_at'
    ];
}

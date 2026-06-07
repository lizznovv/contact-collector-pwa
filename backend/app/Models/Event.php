<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';

    protected $fillable = [
        'name',
        'description',
        'event_date',
        'end_date',
        'is_active',
    ];

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}

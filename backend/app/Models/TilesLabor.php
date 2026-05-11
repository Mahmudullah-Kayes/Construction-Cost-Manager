<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TilesLabor extends Model
{
    use HasFactory;

    protected $table = 'tiles_labor';

    protected $fillable = [
        'date',
        'paid_amount',
    ];

    protected $casts = [
        'date' => 'date',
        'paid_amount' => 'decimal:2',
    ];
}

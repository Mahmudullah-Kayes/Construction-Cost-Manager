<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MiscCost extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'note',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];
}

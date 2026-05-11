<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Get all materials for this user
     */
    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    /**
     * Get all labor costs for this user
     */
    public function laborCosts()
    {
        return $this->hasMany(LaborCost::class);
    }

    /**
     * Get all misc costs for this user
     */
    public function miscCosts()
    {
        return $this->hasMany(MiscCost::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Property extends Model
{
    use HasFactory;
    protected $fillable = [
        'condominium_id',
        'type',
        'number',
        'block',
        'floor',
        'area_sqm',
        'status',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function owners()
    {
        return $this->hasMany(OwnerProfile::class);
    }

    public function residents()
    {
        return $this->hasMany(ResidentProfile::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function fines()
    {
        return $this->hasMany(Fine::class);
    }
}

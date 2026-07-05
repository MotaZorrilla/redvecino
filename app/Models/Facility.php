<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'name',
        'type',
        'capacity',
        'fee',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }
}

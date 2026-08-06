<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UnitMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_profile_id',
        'first_name',
        'last_name',
        'rut',
        'birth_date',
        'is_owner',
        'lives_in_unit',
    ];

    protected $casts = [
        'is_owner' => 'boolean',
        'lives_in_unit' => 'boolean',
    ];

    public function unitProfile()
    {
        return $this->belongsTo(UnitProfile::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Afp extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'commission_rate',
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'decimal:2',
        ];
    }

    public function employees()
    {
        return $this->hasMany(EmployeeProfile::class, 'afp_id');
    }
}

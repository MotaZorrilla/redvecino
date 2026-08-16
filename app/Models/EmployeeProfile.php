<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmployeeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'supervisor_id',
        'contract_type',
        'shift',
        'salary',
        'hire_date',
        'afp_id',
        'bank_name',
        'account_type',
        'account_number',
        'payment_method',
        'allow_supplies',
    ];

    protected function casts(): array
    {
        return [
            'salary' => 'decimal:2',
            'hire_date' => 'date',
            'allow_supplies' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function afp()
    {
        return $this->belongsTo(Afp::class, 'afp_id');
    }

    public function liquidations()
    {
        return $this->hasMany(Liquidation::class);
    }

    public function sanctions()
    {
        return $this->hasMany(EmployeeSanction::class);
    }

    public function attendances()
    {
        return $this->hasMany(EmployeeAttendance::class);
    }
}


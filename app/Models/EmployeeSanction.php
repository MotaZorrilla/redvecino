<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeSanction extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'employee_profile_id',
        'date',
        'time',
        'reason',
        'description',
        'document_path',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function employeeProfile()
    {
        return $this->belongsTo(EmployeeProfile::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

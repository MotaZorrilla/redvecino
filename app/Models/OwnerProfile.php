<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OwnerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_id',
        'ownership_percentage',
        'financial_status',
    ];

    protected function casts(): array
    {
        return [
            'ownership_percentage' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}

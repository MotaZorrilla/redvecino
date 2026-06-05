<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommitteeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'period_start',
        'period_end',
        'permission_level',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

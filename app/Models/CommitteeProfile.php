<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommitteeProfile extends Model
{
    protected $fillable = [
        'user_id',
        'position',
        'period_start',
        'period_end',
        'permission_level',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

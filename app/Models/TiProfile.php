<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiProfile extends Model
{
    protected $fillable = [
        'user_id',
        'access_level',
        'system_logs_permission',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

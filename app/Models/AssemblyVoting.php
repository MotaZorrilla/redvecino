<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssemblyVoting extends Model
{
    use HasFactory;

    protected $fillable = [
        'condominium_id',
        'title',
        'description',
        'quorum_required_percent',
        'status',
        'created_by',
        'starts_at',
        'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'quorum_required_percent' => 'float',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function options()
    {
        return $this->hasMany(AssemblyVotingOption::class);
    }

    public function votes()
    {
        return $this->hasMany(AssemblyUnitVote::class);
    }
}

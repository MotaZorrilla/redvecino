<?php

namespace App\Policies;

use App\Models\CommitteeProfile;
use App\Models\User;

class CommitteeProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    public function view(User $user, CommitteeProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, CommitteeProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function delete(User $user, CommitteeProfile $model): bool
    {
        return $user->can('manage users');
    }
}

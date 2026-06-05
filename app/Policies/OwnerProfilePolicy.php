<?php

namespace App\Policies;

use App\Models\OwnerProfile;
use App\Models\User;

class OwnerProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    public function view(User $user, OwnerProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, OwnerProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function delete(User $user, OwnerProfile $model): bool
    {
        return $user->can('manage users');
    }
}

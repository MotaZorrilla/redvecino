<?php

namespace App\Policies;

use App\Models\AdminProfile;
use App\Models\User;

class AdminProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    public function view(User $user, AdminProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, AdminProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function delete(User $user, AdminProfile $model): bool
    {
        return $user->can('manage users');
    }
}

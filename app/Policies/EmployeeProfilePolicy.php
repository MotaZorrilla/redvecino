<?php

namespace App\Policies;

use App\Models\EmployeeProfile;
use App\Models\User;

class EmployeeProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    public function view(User $user, EmployeeProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    public function update(User $user, EmployeeProfile $model): bool
    {
        return $user->can('manage users') || $model->user_id === $user->id;
    }

    public function delete(User $user, EmployeeProfile $model): bool
    {
        return $user->can('manage users');
    }
}

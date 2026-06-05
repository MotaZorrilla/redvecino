<?php

namespace App\Policies;

use App\Models\CondoIncome;
use App\Models\User;

class CondoIncomePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view financial reports');
    }

    public function view(User $user, CondoIncome $model): bool
    {
        return $user->can('view financial reports') || $model->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('approve expenses');
    }

    public function update(User $user, CondoIncome $model): bool
    {
        return $user->can('approve expenses');
    }

    public function delete(User $user, CondoIncome $model): bool
    {
        return $user->can('approve expenses');
    }
}

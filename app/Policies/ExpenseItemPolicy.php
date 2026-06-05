<?php

namespace App\Policies;

use App\Models\ExpenseItem;
use App\Models\User;

class ExpenseItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view financial reports');
    }

    public function view(User $user, ExpenseItem $model): bool
    {
        return $user->can('view financial reports');
    }

    public function create(User $user): bool
    {
        return $user->can('approve expenses');
    }

    public function update(User $user, ExpenseItem $model): bool
    {
        return $user->can('approve expenses');
    }

    public function delete(User $user, ExpenseItem $model): bool
    {
        return $user->can('approve expenses');
    }
}

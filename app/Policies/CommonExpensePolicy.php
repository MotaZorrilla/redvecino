<?php

namespace App\Policies;

use App\Models\CommonExpense;
use App\Models\User;

class CommonExpensePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view financial reports');
    }

    public function view(User $user, CommonExpense $model): bool
    {
        return $user->can('view financial reports');
    }

    public function create(User $user): bool
    {
        return $user->can('approve expenses');
    }

    public function update(User $user, CommonExpense $model): bool
    {
        return $user->can('approve expenses');
    }

    public function delete(User $user, CommonExpense $model): bool
    {
        return $user->can('approve expenses');
    }
}

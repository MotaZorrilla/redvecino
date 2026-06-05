<?php

namespace App\Policies;

use App\Models\Announcement;
use App\Models\User;

class AnnouncementPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('publish announcements');
    }

    public function view(User $user, Announcement $model): bool
    {
        return $user->can('publish announcements') || $model->created_by === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('publish announcements');
    }

    public function update(User $user, Announcement $model): bool
    {
        return $user->can('publish announcements') || $model->created_by === $user->id;
    }

    public function delete(User $user, Announcement $model): bool
    {
        return $user->can('publish announcements');
    }
}

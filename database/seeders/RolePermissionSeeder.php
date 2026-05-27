<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Clear cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view profile', 'edit profile', 'view properties',
            'pay common expenses', 'view account statements',
            'create tickets', 'view own tickets', 'assign tickets',
            'resolve tickets', 'view financial reports', 'approve expenses',
            'manage users', 'configure system', 'view logs',
            'manage roles', 'publish announcements', 'send messages',
        ];

        foreach ($permissions as $permission) {
            $p = Permission::findOrCreate($permission, 'web');
        }

        $all = Permission::where('guard_name', 'web')->pluck('name')->toArray();
        dump($all);

        $owner = Role::findOrCreate('Propietario', 'web');
        $owner->syncPermissions(['view profile', 'edit profile', 'view properties',
            'pay common expenses', 'view account statements', 'create tickets',
            'view own tickets', 'send messages']);

        $resident = Role::findOrCreate('Residente', 'web');
        $resident->syncPermissions(['view profile', 'edit profile', 'view properties',
            'pay common expenses', 'view account statements', 'create tickets',
            'view own tickets', 'send messages']);

        $committee = Role::findOrCreate('Comité', 'web');
        $committee->syncPermissions(['view profile', 'edit profile', 'view properties',
            'pay common expenses', 'view account statements', 'create tickets',
            'view own tickets', 'approve expenses', 'view financial reports',
            'publish announcements', 'send messages']);

        $employee = Role::findOrCreate('Colaborador', 'web');
        $employee->syncPermissions(['view profile', 'edit profile',
            'create tickets', 'view own tickets', 'resolve tickets', 'send messages']);

        $admin = Role::findOrCreate('Administrador', 'web');
        $admin->syncPermissions(['view profile', 'edit profile', 'view properties',
            'pay common expenses', 'view account statements', 'create tickets',
            'view own tickets', 'assign tickets', 'resolve tickets',
            'view financial reports', 'approve expenses', 'manage users',
            'publish announcements', 'send messages']);

        $ti = Role::findOrCreate('TI', 'web');
        $ti->syncPermissions(['view profile', 'edit profile', 'view properties',
            'create tickets', 'view own tickets', 'manage users',
            'configure system', 'view logs', 'manage roles', 'send messages']);
    }
}

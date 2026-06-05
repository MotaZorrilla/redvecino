<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Exceptions\RoleDoesNotExist;
use Spatie\Permission\PermissionRegistrar;

class TiPermissionController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        $permissions = Permission::all();

        $matrix = [];
        foreach ($roles as $role) {
            $matrix[$role->name] = $role->permissions->pluck('name')->toArray();
        }

        return response()->json([
            'roles' => $roles->pluck('name')->toArray(),
            'permissions' => $permissions->pluck('name')->toArray(),
            'matrix' => $matrix,
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'role' => 'required|string',
            'permission' => 'required|string',
        ]);

        try {
            $role = Role::findByName($request->role, 'web');
        } catch (RoleDoesNotExist $e) {
            return response()->json(['error' => "Rol '{$request->role}' no encontrado."], 404);
        }
        $permission = Permission::findOrCreate($request->permission, 'web');

        if ($role->hasPermissionTo($permission)) {
            $role->revokePermissionTo($permission);
            $action = 'revoked';
        } else {
            $role->givePermissionTo($permission);
            $action = 'granted';
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        return response()->json([
            'success' => true,
            'action' => $action,
            'message' => "Permiso '{$request->permission}' " . ($action === 'granted' ? 'otorgado' : 'revocado') . " al rol '{$request->role}'.",
        ]);
    }
}

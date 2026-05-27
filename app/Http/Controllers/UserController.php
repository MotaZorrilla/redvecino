<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return User::with(['roles', 'permissions'])->paginate(20);
    }

    public function show($id)
    {
        return User::with(['roles', 'permissions', 'ownerProfile', 'residentProfile',
            'committeeProfile', 'employeeProfile', 'adminProfile', 'tiProfile'])
            ->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'rut' => 'nullable|string|unique:users',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8',
            'status' => 'nullable|string|in:active,inactive,suspended',
        ]);

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        if ($request->roles) {
            $user->assignRole($request->roles);
        }

        return $user->load('roles');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'rut' => ['nullable', 'string', Rule::unique('users')->ignore($id)],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($id)],
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'status' => 'nullable|string|in:active,inactive,suspended',
        ]);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);
        return $user->load('roles');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->noContent();
    }

    public function assignRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->syncRoles($request->roles);
        return $user->load('roles');
    }
}

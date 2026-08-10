<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

final class PinLoginController extends Controller
{
    /**
     * Autenticación mediante PIN / RUT de residente/conserje.
     */
    public function loginPin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rut' => 'required|string',
            'pin' => 'required|string|numeric|digits:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'La validación falló.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('rut', $request->rut)->first();

        if (!$user || $user->pin !== $request->pin) {
            return response()->json([
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        $token = $user->createToken('pin-auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Autenticación exitosa vía PIN.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ],
        ], 200);
    }
}

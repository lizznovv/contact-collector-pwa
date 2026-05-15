<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginFormRequest;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    public function login(LoginFormRequest $request)
    {
        $validated = $request->validated();

        if (is_numeric($validated['login']))
        {
            $credentials = [
                'phone' => $validated['login'],
                'password' => $validated['password']
            ];
        }
        else
        {
            $credentials = [
                'email' => $validated['login'],
                'password' => $validated['password']
            ];
        }
        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Неправильный логин или пароль'
            ], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::guard('api')->user(),
        ]);
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

}

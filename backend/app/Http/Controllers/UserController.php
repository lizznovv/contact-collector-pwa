<?php

namespace App\Http\Controllers;

use App\Services\AuditLogger;
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

            AuditLogger::log('LOGIN_FAILED', 'error', payload: [
                'login' => $validated['login'],
            ]);

            return response()->json([
                'message' => 'Неправильный логин или пароль'
            ], 401);
        }

        AuditLogger::log('LOGIN_SUCCESS', payload: [
            'login' => $validated['login'],
        ]);

        return response()->json([
            'access_token' => $token,
            'refresh_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::guard('api')->user(),
        ]);
    }

    public function logout()
    {

        AuditLogger::log('LOGOUT');

        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'access_token' => Auth::guard('api')->refresh(),
            'token_type' => 'bearer',
        ]);
    }
}

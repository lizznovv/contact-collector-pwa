<?php

namespace App\Http\Controllers;

use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use App\Http\Requests\LoginFormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\RefreshToken;


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

        $refreshToken = Str::random(128);
        RefreshToken::create([
            'user_id' => Auth::guard('api')->user()->id,
            'token' => hash('sha256', $refreshToken), // Храним хеш для безопасности
            'expires_at' => Carbon::now()->addDays(30),
        ]);


        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => Auth::guard('api')->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $refreshTokenValue = $request->input('refresh_token');
        if (!$refreshTokenValue)
        {
            return response()->json(['message' => 'Refresh token required'], 400);
        }

        $tokenRecord = RefreshToken::where('token', hash('sha256', $refreshTokenValue))
            ->where('expires_at', '>', Carbon::now())
            ->first();
        if ($tokenRecord)
        {
            $tokenRecord->delete();
        }

        AuditLogger::log('LOGOUT');

        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function refresh(Request $request)
    {
        $refreshTokenValue = $request->input('refresh_token');
        if (!$refreshTokenValue)
        {
            return response()->json(['message' => 'Refresh token required'], 400);
        }

        $tokenRecord = RefreshToken::where('token', hash('sha256', $refreshTokenValue))
            ->where('expires_at', '>', Carbon::now())
            ->first();
        if (!$tokenRecord)
        {
            return response()->json(['message' => 'Invalid or expired refresh token'], 401);
        }

        $user = $tokenRecord->user;
        $newAccessToken = Auth::guard('api')->login($user);

        $tokenRecord->delete();
        $newRefreshToken = Str::random(128);
        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $newRefreshToken),
            'expires_at' => Carbon::now()->addDays(30),
        ]);

        return response()->json([
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'token_type' => 'bearer',
        ]);
    }
}

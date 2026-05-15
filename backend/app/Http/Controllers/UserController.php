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
        if (Auth::attempt($credentials)) {
            //$request->session()->regenerate();

            return response()->json([
                'message' => 'Login successful',
                'user' => Auth::user()
            ]);
            //return redirect()->intended('dashboard');
        }

        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);

        /*return back()
            ->withErrors(['login' => 'Неправильный логин или пароль'])
            ->onlyInput('login');
        */
    }

    public function logout(Request $request)
    {
        Auth::logout();
        //$request->session()->invalidate();
        //$request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful'
        ]);
        //return redirect()->route('login');
    }

}

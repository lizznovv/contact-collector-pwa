<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use App\Http\Requests\ManagerRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ManagerController extends Controller
{
    public function index()
    {
        $managers = User::where('role', 'manager')->get();

        return response()->json([
            'managers' => $managers
        ]);
    }
    public function create()
    {
        return response()->json([
            'message' => 'successfully created'
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate();
        try {
            $manager = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($request->password),
                'role' => 'manager',
            ]);
        }
        catch (\Exception $exception) {

            //потом логирование добавлю
            throw $exception;
        }

        return response()->json([
            'message' => 'Manager created successfully',
            'manager' => $manager
        ], 201);
        //return redirect()->route('managers.index');
    }
    public function show($id)
    {
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();

        return response()->json([
            'manager' => $manager
        ]);
    }
    public function edit($id)
    {
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();

        return response()->json([
            'manager' => $manager
        ]);
    }
    public function update(ManagerRequest $request, $id)
    {
        $validated = $request->validated();
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();
        $manager->update($validated);

        return response()->json([
            'message' => 'Manager updated successfully',
            'manager' => $manager
        ]);
        //роуты позже пропишу
        //return redirect()->route('managers.index');
    }
    public function destroy($id)
    {
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();
        $manager->delete();

        return response()->json([
            'message' => 'Manager deleted successfully'
        ]);
        //роуты позже пропишу
        //return redirect()->route('managers.index');
    }
}

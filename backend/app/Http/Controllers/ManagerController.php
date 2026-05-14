<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\ManagerRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ManagerController extends Controller
{
    public function index()
    {
        $managers = User::where('role', 'manager')->get();
        //формы позже пропишу
        return view('managers.index', compact('managers'));
    }
    public function create()
    {
        return view('managers.create');
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

        return redirect()->route('managers.index');
    }
    public function show($id)
    {
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();

        return view('managers.show', compact('manager'));
    }
    public function edit($id)
    {
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();

        return view('managers.edit', compact('manager'));
    }
    public function update(ManagerRequest $request, $id)
    {
        $validated = $request->validated();
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();
        $manager->update($validated);
        //роуты позже пропишу
        return redirect()->route('managers.index');
    }
    public function destroy($id)
    {
        //
    }
}

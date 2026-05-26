<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Services\AuditLogger;
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
    public function store(ManagerRequest $request)
    {
        $validated = $request->validated();
        try {
            $manager = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => $validated['password'],
                'role' => 'manager',
            ]);

            AuditLogger::log(
                'CREATE_MANAGER',
                entityType: 'User',
                entityId: $manager->id,
                payload: ['name' => $manager->name, 'email' => $manager->email]
            );

        }
        catch (\Exception $exception) {

            AuditLogger::log('CREATE_MANAGER', 'error', errorMessage: $exception->getMessage());
            throw $exception;
        }

        return response()->json([
            'message' => 'Manager created successfully',
            'manager' => $manager
        ], 201);
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
    public function update(ManagerRequest $request, $id)
    {
        $validated = $request->validated();

        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();

        $old = $manager->only(['name', 'email', 'phone']);
        $manager->update($validated);

        AuditLogger::log(
            'UPDATE_MANAGER',
            entityType: 'User',
            entityId: $manager->id,
            payload: [
                'before' => $old,
                'after'  => $manager->only(['name', 'email', 'phone']),
            ]
        );

        return response()->json([
            'message' => 'Manager updated successfully',
            'manager' => $manager
        ]);
    }
    public function destroy($id)
    {
        $manager = User::where('id', $id)
            ->where('role', 'manager')
            ->firstOrFail();

        AuditLogger::log(
            'DELETE_MANAGER',
            entityType: 'User',
            entityId: $manager->id,
            payload: ['name' => $manager->name, 'email' => $manager->email]
        );

        $manager->delete();

        return response()->json([
            'message' => 'Manager deleted successfully'
        ]);
    }
}

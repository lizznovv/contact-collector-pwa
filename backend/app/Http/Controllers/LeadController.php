<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeadRequest;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::all();

        return response()->json(['leads' => $leads]);
    }
    public function store(LeadRequest $request)
    {
        $validated = $request->validated();

        try {
            $lead = Lead::create([
                'user_id' => auth()->id(),
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'event_id' => $validated['event_id'],
                'company' => $validated['company'] ?? null,
                'position' => $validated['position'] ?? null,
            ]);
        }
        catch (\Exception $exception)
        {
            //потом логирование добавлю
            throw $exception;
        }
        return response()->json([
            'message' => 'Lead created successfully',
            'lead' => $lead
        ], 201);
    }
    public function show($id)
    {
        $lead = Lead::findOrFail($id);

        return response()->json(['lead' => $lead]);
    }
    public function update(LeadRequest $request, $id)
    {
        $validated = $request->validated();
        $lead = Lead::findOrFail($id);
        $lead->update($validated);

        return response()->json([
            'message' => 'Lead updated successfully',
            'lead' => $lead
        ]);

    }
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();

        return response()->json([
            'message' => 'Lead deleted successfully'
        ]);

    }

}

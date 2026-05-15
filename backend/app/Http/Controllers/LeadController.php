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
    public function create()
    {
        return response()->json(['message' => 'Create lead form']);
    }
    public function store(LeadRequest $request)
    {
        $validated = $request->validated();

        try {
            $lead = Lead::create([
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'event' => $validated['event'],
                'service' => $validated['service'],
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
        //return redirect()->route('leads.index');
    }
    public function show($id)
    {
        $lead = Lead::findOrFail($id);

        return response()->json(['lead' => $lead]);
    }
    public function edit($id)
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
        //роуты позже пропишу
        //return redirect()->route('leads.index');
    }
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();

        return response()->json([
            'message' => 'Lead deleted successfully'
        ]);
        //роуты позже пропишу
       // return redirect()->route('leads.index');
    }

}

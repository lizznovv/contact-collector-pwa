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
        //формы позже пропишу
        return view('leads.index', compact('leads'));    }
    public function create()
    {
        //формы позже пропишу
        return view('leads.create');
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
        //роуты позже пропишу
        return redirect()->route('leads.index');
    }
    public function show($id)
    {
        $lead = Lead::findOrFail($id);
        //формы позже пропишу
        return view('leads.show', compact('lead'));
    }
    public function edit($id)
    {
        $lead = Lead::findOrFail($id);
        //формы позже пропишу
        return view('leads.edit', compact('lead'));
    }
    public function update(LeadRequest $request, $id)
    {
        $validated = $request->validated();
        $lead = Lead::findOrFail($id);
        $lead->update($validated);
        //роуты позже пропишу
        return redirect()->route('leads.index');
    }
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();
        //роуты позже пропишу
        return redirect()->route('leads.index');
    }

}

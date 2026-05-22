<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Http\Requests\EventRequest;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return response()->json(['$events' => $events]);
    }


    public function store(EventRequest $request)
    {
        $validated = $request->validated();

        try {
            $event = Event::create($validated);
        }
        catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'Ошибка добавления события.'
            ], 500);
        }

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event
        ], 201);
    }


    public function show($id)
    {
        $event = Event::findOrFail($id);

        return response()->json(['event' => $event]);
    }


    public function update(EventRequest $request, $id)
    {
        $validated = $request->validated();
        $event = Event::findOrFail($id);
        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }


    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}

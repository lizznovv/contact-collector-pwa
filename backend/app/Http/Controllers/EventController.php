<?php

namespace App\Http\Controllers;

use App\Services\AuditLogger;
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

            AuditLogger::log(
                'CREATE_EVENT',
                entityType: 'Event',
                entityId: $event->id,
            );
        }
        catch (\Exception $exception) {
            AuditLogger::log('CREATE_EVENT', 'error', errorMessage: $exception->getMessage());

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
        $old = $event->only(['name', 'description', 'event_date', 'is_active',]);
        $event->update($validated);

        AuditLogger::log(
            'UPDATE_EVENT',
            entityType: 'Event',
            entityId: $event->id,
            payload: [
                'before' => $old,
                'after'  => $event->only(['name', 'description', 'event_date', 'is_active',]),
            ]
        );

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }


    public function destroy($id)
    {
        $event = Event::findOrFail($id);

        AuditLogger::log(
            'DELETE_EVENT',
            entityType: 'Event',
            entityId: $event->id,
        );

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}

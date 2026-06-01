<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeadRequest;
use App\Models\Lead;
use App\Services\AuditLogger;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::where('user_id', auth()->id())
            ->get();

        return response()->json(['leads' => $leads]);
    }
    public function store(LeadRequest $request)
    {
        $validated = $request->validated();

        $existing = Lead::where('phone', $validated['phone'])
            ->where('email', $validated['email'])
            ->first();

        if ($existing) {
            return response()->json([
                'duplicate_found' => true,
                'message'         => 'Заявка с таким телефоном и email уже существует.',
                'existing_lead'   => $existing,
                'actions'         => [
                    'update'           => "/api/leads/{$existing->id}",
                    'cancel' => 'Cancel',
                ],
            ], 409);
        }

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

            AuditLogger::log(
                'CREATE_LEAD',
                entityType: 'Lead',
                entityId: $lead->id,
                payload: ['phone' => $lead->phone, 'email' => $lead->email]
            );

            if (!empty($validated['product'])) {
                $lead->products()->attach($validated['product']);
            }
        }
        catch (\Exception $exception)
        {
            AuditLogger::log('CREATE_LEAD', 'error', errorMessage: $exception->getMessage());
            throw $exception;
        }
        return response()->json([
            'duplicate_found' => false,
            'status' => 'success',
            'id' => $lead->id,
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

        $old = $lead->only(['full_name', 'phone', 'email', 'company', 'position']);
        $lead->update($validated);

        AuditLogger::log(
            'UPDATE_LEAD',
            entityType: 'Lead',
            entityId: $lead->id,
            payload: [
                'before' => $old,
                'after'  => $lead->only(['full_name', 'phone', 'email', 'company', 'position']),
            ]
        );

        return response()->json([
            'message' => 'Lead updated successfully',
            'lead' => $lead
        ]);

    }
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);

        AuditLogger::log(
            'DELETE_LEAD',
            entityType: 'Lead',
            entityId: $lead->id,
            payload: [
                'phone' => $lead->phone,
                'email' => $lead->email,
            ]
        );

        $lead->delete();

        return response()->json([
            'message' => 'Lead deleted successfully'
        ]);
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 'error',
            'message' => 'Невалидные данные.',
            'errors' => $validator->errors()
        ], 400));
    }

}

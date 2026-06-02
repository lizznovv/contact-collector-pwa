<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LeadFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'manager_id' => 'nullable|integer|exists:users,id',
            'event_id'   => 'nullable|integer|exists:events,id',
            'product_id' => 'nullable|integer|exists:products,id',
            'date_from'  => 'nullable|date',
            'date_to'    => 'nullable|date',
        ];
    }
}

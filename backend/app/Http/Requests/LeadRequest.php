<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LeadRequest extends FormRequest
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
            'full_name' => 'required|string|max:255',
            'phone' => 'required|regex:/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/',
            'email' => 'required|email',
            'event_id' => 'required|integer|exists:events,id',
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Телефон должен соответствовать формату +7 (xxx) xxx-xx-xx.',
            'email.email' => 'Неверный формат email адреса.',
            'required' => 'Поле :attribute обязательно для заполнения.',
        ];
    }


}

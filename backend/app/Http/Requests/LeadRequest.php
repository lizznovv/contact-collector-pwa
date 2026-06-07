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

    protected function prepareForValidation(): void
    {
        if ($this->phone) {
            $this->merge([
                'phone' => $this->normalizePhone($this->phone),
            ]);
        }
    }

    private function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);

        if (strlen($digits) === 11 && str_starts_with($digits, '8')) {
            $digits = '7' . substr($digits, 1);
        }

        return '+' . $digits;
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
            'phone'     => ['nullable', 'required_without:email', 'regex:/^\+7\d{10}$/'],
            'email'     => ['nullable', 'required_without:phone', 'email'],
            'event_id'  => 'required|integer|exists:events,id',
            'company'   => 'nullable|string|max:255',
            'position'  => 'nullable|string|max:255',
            'product'   => 'required|array',
            'product.*' => 'integer|exists:products,id',
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Телефон должен соответствовать формату +7 (xxx) xxx-xx-xx.',
            'email.email' => 'Неверный формат email адреса.',
            'required' => 'Поле :attribute обязательно для заполнения.',
            'phone.required_without' =>
                'Укажите телефон или email.',

            'email.required_without' =>
                'Укажите телефон или email.',
        ];
    }


}

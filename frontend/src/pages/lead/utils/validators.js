export function validateRequired(value, fieldLabel = "Это поле") {
    if (!value || String(value).trim() === "") {
        return `${fieldLabel} обязательно для заполнения`;
    }
    return null;
}

export function validateEmail(value) {
    if (!value || String(value).trim() === "") {
        return "Email обязателен";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(value).trim())) {
        return "Неверный формат email адреса";
    }
    return null;
}

export function applyPhoneMask(value) {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
        digits = "7" + digits.slice(1);
    }
    if (!digits.startsWith("7")) {
        digits = "7" + digits;
    }

    digits = digits.slice(0, 11);

    let result = "+7";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 4) result += ") " + digits.slice(4, 7);
    if (digits.length >= 7) result += "-" + digits.slice(7, 9);
    if (digits.length >= 9) result += "-" + digits.slice(9, 11);

    return result;
}

export function validatePhone(value) {
    if (!value || String(value).trim() === "") {
        return "Телефон обязателен";
    }
    const digits = value.replace(/\D/g, "");
    if (digits.length < 11) {
        return "Телефон должен соответствовать формату +7 (xxx) xxx-xx-xx";
    }
    return null;
}

export function validateStringField(value, fieldLabel = "Поле", maxLength = 255) {
    const required = validateRequired(value, fieldLabel);
    if (required) return required;
    if (String(value).trim().length > maxLength) {
        return `${fieldLabel} не должно превышать ${maxLength} символов`;
    }
    return null;
}

export function validateEventId(value) {
    if (!value && value !== 0) {
        return "Выберите событие";
    }
    return null;
}

export function validateProduct(value) {
    if (!value && value !== 0) {
        return "Выберите продукт";
    }
    return null;
}

export function validateLeadForm(fields) {
    return {
        full_name: validateStringField(fields.full_name, "ФИО"),
        email:     validateEmail(fields.email),
        phone:     validatePhone(fields.phone),
        event_id:  validateEventId(fields.event_id),
        company:   validateStringField(fields.company, "Компания"),
        position:  validateStringField(fields.position, "Должность"),
        product:   validateProduct(fields.product),
    };
}

export function hasErrors(errors) {
    return Object.values(errors).some((err) => err !== null);
}
import { useState } from "react";
import {
    validateRequired,
    validateEmail,
    validatePhone,
    validateProduct,
    applyPhoneMask,
} from "../utils/validators";

export function useLeadForm(initialForm, setForm, originalForm, setOriginalForm, isEditRoute) {
    const [errors, setErrors]   = useState({});
    const [isEditing, setIsEditing] = useState(!isEditRoute);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            setForm(prev => ({ ...prev, phone: applyPhoneMask(value) }));
            return;
        }

        if (name === "full_name") {
            setForm(prev => ({
                ...prev,
                full_name: value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, ""),
            }));
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEventsChange = (e) => {
        const val = e.target.value;
        setForm(prev => ({ ...prev, event_id: val ? Number(val) : null }));
    };

    const handleProductsChange = (e) => {
        const selected = Array.from(
            e.target.selectedOptions,
            option => Number(option.value)
        );
        setForm(prev => ({ ...prev, product_ids: selected }));
    };

    const handleCancel = (navigate) => {
        if (isEditRoute) {
            setForm(originalForm);
            setErrors({});
            setIsEditing(false);
        } else {
            navigate(-1);
        }
    };

    const validateForm = (form) => {
        const newErrors = {
            full_name: validateRequired(form.full_name, "ФИО"),
            phone:     validatePhone(form.phone),
            email:     validateEmail(form.email),
            event_id:  validateProduct(form.event_id),
            product:   validateProduct(form.product_ids),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    return {
        errors,
        isEditing,
        setIsEditing,
        handleChange,
        handleEventsChange,
        handleProductsChange,
        handleCancel,
        validateForm,
    };
}
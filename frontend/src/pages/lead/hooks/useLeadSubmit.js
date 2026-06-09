import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isServerAvailable } from "../../../services/networkService";
import { syncPendingLeads } from "../../../services/syncService";
import {
    addPendingLead,
    updatePendingLead,
    deletePendingLead,
} from "../../../services/pendingLeadsService";
import { deleteDraft } from "../../../services/draftsService";
import { buildPayload } from "../utils/leadFormUtils";

export function useLeadSubmit({
    form,
    isEditRoute,
    id,
    leadSource,
    draftId,
    validateForm,
    setOriginalForm,
    setIsEditing,

}) {
    const navigate  = useNavigate();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();if (!validateForm(form)) return;

        const payload = buildPayload(form);
        setSaving(true);

        try {
            if (isEditRoute) {
                await submitEdit(payload);
            } else {
                await submitCreate(payload);
            }
        } finally {
            setSaving(false);
        }
    };

    const submitEdit = async (payload) => {
        const online = await isServerAvailable();

        if (!online) {
            if (leadSource === "local") {
                await updatePendingLead(Number(id), payload);
            } else {
                await addPendingLead({ ...payload, _updateId: id });
            }
            alert("Изменения сохранены локально");
            setOriginalForm(form);
            setIsEditing(false);
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            await axios.put(`/api/leads/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Idempotency-Key": crypto.randomUUID(),
                },
            });
            alert("Lead успешно обновлен");
            setOriginalForm(form);
            setIsEditing(false);
        } catch (error) {
            if (!error.response) {
                await addPendingLead({ ...payload, _updateId: id });
                alert("Изменения сохранены локально");
                setOriginalForm(form);
                setIsEditing(false);
                return;
            }
            alert("Ошибка: " + JSON.stringify(error.response?.data));
        }
    };

    const submitCreate = async (payload) => {
        try {
            await addPendingLead(payload);

            if (draftId) {
                await deleteDraft(draftId);
            }

            const available = await isServerAvailable();
            if (available) {
                await syncPendingLeads();
            }

            alert(available ? "Lead успешно создан" : "Lead сохранён локально");
            navigate("/dashboard");

        } catch (error) {
            console.error("submitCreate error:", error);

            if (error.response?.status === 409) {
                const confirmed = window.confirm(
                    "Заявка с таким телефоном и email уже существует.\nОбновить существующую заявку?"
                );
                if (confirmed) {
                    const token = localStorage.getItem("access_token");
                    await axios.put(`/api/leads/${error.response.data.existing_lead.id}`, payload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                            "Idempotency-Key": crypto.randomUUID(),
                        },
                    });
                    if (draftId) {
                        await deleteDraft(draftId);
                    }
                    alert("Заявка обновлена");
                    navigate("/dashboard");
                }
                return;
            }

            alert("Ошибка: " + JSON.stringify(error.response?.data));
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Вы уверены, что хотите удалить этого лида?");
        if (!confirmed) return;

        setSaving(true);
        try {
            if (leadSource === "local") {
                await deletePendingLead(id);
            } else {
                const token = localStorage.getItem("access_token");
                await axios.delete(`/api/leads/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
            }
            alert("Lead успешно удален");
            navigate("/dashboard");
        } catch (error) {
            alert("Ошибка удаления: " + JSON.stringify(error.response?.data || error.message));
        } finally {
            setSaving(false);
        }
    };

    return { saving, handleSubmit, handleDelete };
}
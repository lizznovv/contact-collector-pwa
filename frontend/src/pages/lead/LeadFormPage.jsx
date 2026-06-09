import {useState, useEffect} from "react";
import { isFormValid } from "./utils/leadFormUtils";
import { INITIAL_FORM } from "./utils/leadFormConstants.js";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLeadData }       from "./hooks/useLeadData";
import { useLeadForm }       from "./hooks/useLeadForm";
import { useLeadSubmit }     from "./hooks/useLeadSubmit";
import { useDraftAutosave }  from "./hooks/useDraftAutosave";
import { useReferenceData }  from "./hooks/useReferenceData";
import LeadFormFields        from "./components/LeadFormFields";
import LeadFormActions       from "./components/LeadFormActions";

export default function LeadFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditRoute= Boolean(id);

    const { events, products } = useReferenceData();


    const {
        form, setForm,
        originalForm, setOriginalForm,
        leadSource, loading,
    } = useLeadData(id, isEditRoute);

    const {
        errors, isEditing, setIsEditing,
        handleChange, handleEventsChange, handleProductsChange,
        handleCancel, validateForm,
    } = useLeadForm(form, setForm, originalForm, setOriginalForm, isEditRoute);

    const [draftId, setDraftId] = useState(null);
    const [draftLoaded, setDraftLoaded] = useState(isEditRoute);



    useEffect(() => {
        if (isEditRoute) return;

        const draft = location.state?.draft;

        if (draft) {
            setDraftId(draft.id);
            setForm({
                ...INITIAL_FORM,
                id:          draft.id,
                full_name:   draft.full_name   ?? "",
                phone:       draft.phone       ?? "",
                email:       draft.email       ?? "",
                company:     draft.company     ?? "",
                position:    draft.position    ?? "",
                event_id:    draft.event_id    ?? null,
                product_ids: draft.product_ids ?? [],
            });
        }

        setDraftLoaded(true);
    }, [location.state, isEditRoute]);

    useDraftAutosave(form, draftLoaded, isEditRoute);

    const { saving, handleSubmit, handleDelete } = useLeadSubmit({
        form,
        isEditRoute,
        id,
        leadSource,
        draftId,
        validateForm,
        setOriginalForm,
        setIsEditing,
    });

    if (loading) return <p>Загрузка...</p>;

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>
                    {isEditRoute
                        ? (isEditing ? "Редактирование заявки" : "Просмотр заявки")
                        : "Новая заявка"}
                </h2>
                <button type="button" onClick={() => navigate("/")}>
                    ← Главная
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <LeadFormFields
                    form={form}
                    errors={errors}
                    events={events}
                    products={products}
                    isEditing={isEditing}
                    onFieldChange={handleChange}
                    onEventsChange={handleEventsChange}
                    onProductsChange={handleProductsChange}
                />
                {isEditing && (
                    <LeadFormActions
                        isFormValid={isFormValid(form)}
                        saving={saving}
                        onCancel={() => handleCancel(navigate)}
                    />
                )}
            </form>

            {isEditRoute && !isEditing && (
                <div style={{ display: "flex", gap: 12 }}>
                    <button type="button" onClick={() => setIsEditing(true)}>
                        Редактировать
                    </button>
                    <button type="button" onClick={handleDelete} disabled={saving}>
                        {saving ? "Удаление..." : "Удалить лид"}
                    </button>
                </div>
            )}
        </div>
    );
}

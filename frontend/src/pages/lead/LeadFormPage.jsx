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
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditRoute = Boolean(id);

    const {events, products} = useReferenceData();

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
                comments:    draft.comments    ?? "",
                event_id:    draft.event_id    ?? null,
                product_ids: draft.product_ids ?? [],
            });
        }

        setDraftLoaded(true);
    }, [location.state, isEditRoute]);

    const { skipRef } = useDraftAutosave(form, draftLoaded, isEditing, setDraftId);

    const {saving, handleSubmit, handleDelete} = useLeadSubmit({
        form,
        isEditRoute,
        id,
        leadSource,
        draftId,
        validateForm,
        setOriginalForm,
        setIsEditing,
        skipAutosaveRef: skipRef,
    });

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="page-container">
            <div className="page-card">
                <div className="page-header">
                    <h2 className="page-title">
                        {isEditRoute
                            ? (isEditing ? "Редактирование заявки" : "Просмотр заявки")
                            : "Новая заявка"}
                    </h2>
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        ← Главная
                    </button>

                    {isEditRoute && !isEditing && (
                        <>
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => setIsEditing(true)}
                            >
                                Редактировать
                            </button>
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={handleDelete}
                                disabled={saving}
                            >
                                {saving ? "Удаление..." : "Удалить лид"}
                            </button>
                        </>
                    )}
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
            </div>
        </div>
    );
}
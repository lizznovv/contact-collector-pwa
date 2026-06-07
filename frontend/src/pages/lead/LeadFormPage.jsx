import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
    validateRequired,
    validateEmail,
    validatePhone,
    validateProduct,
    applyPhoneMask
} from "../../utils/validators";
import {
    addPendingLead,
    getPendingLeadById,
    deletePendingLead,
    updatePendingLead
} from "../../services/pendingLeadsService";
import { syncPendingLeads } from "../../services/syncService";
import { isServerAvailable } from "../../services/networkService";
import {getCachedEvents, getCachedProducts} from '../../services/referenceDataService';
import {
    saveDraft,
    deleteDraft
} from '../../services/draftsService';

export default function LeadFormPage() {
    console.log("LeadFormPage rendered");
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditRoute = Boolean(id);

    const [form, setForm] = useState(() => ({
        id: crypto.randomUUID(),
        full_name: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        event_id: null,
        product_ids: []
    }));

    const [originalForm, setOriginalForm] = useState({
            full_name: "",
            phone: "",
            email: "",
            company: "",
            position: "",
            event_id: null,
            product_ids: []
        }
    );

    const [events, setEvents] = useState([]);
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(!isEditRoute);
    const [loading, setLoading] = useState(isEditRoute);
    const [saving, setSaving] = useState(false);
    const [leadSource, setLeadSource] = useState('server');
    const [draftId, setDraftId] = useState(null);
    const [draftLoaded, setDraftLoaded] = useState(false);


    useEffect(() => {
        const load = async () => {
            try {
                const [cachedEvents, cachedProducts] = await Promise.all([
                    getCachedEvents(),
                    getCachedProducts(),
                ]);
                setEvents(cachedEvents.filter(event => event.is_active));
                setProducts(cachedProducts.filter(product => product.is_active));

                if (isEditRoute) {
                    const online = await isServerAvailable();

                    if (!online){
                        const localLead = await getPendingLeadById(Number(id));
                        if (localLead) {
                            setLeadSource('local');
                            const filled = {
                                full_name: localLead.full_name ?? "",
                                phone: localLead.phone ?? "",
                                email: localLead.email ?? "",
                                company: localLead.company ?? "",
                                position: localLead.position ?? "",
                                event_id: localLead.event_id ?? null,
                                product_ids: localLead.product ?? [],
                            };
                            setForm(filled);
                            setOriginalForm(filled);
                        } else {
                            alert("Заявка не найдена локально");
                            navigate(-1);
                        }
                    } else{
                        try {
                            const token = localStorage.getItem("access_token");

                            const { data } = await axios.get(`/api/leads/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    Accept: "application/json"
                                },
                            });

                            setLeadSource('server');

                            const lead = data.lead ?? data;

                            const filled = {
                                full_name: lead.full_name ?? "",
                                phone: lead.phone ?? "",
                                email: lead.email ?? "",
                                company: lead.company ?? "",
                                position: lead.position ?? "",
                                event_id: lead.event_id ?? null,
                                product_ids: lead.products
                                    ? lead.products.map(p => p.id ?? p)
                                    : (lead.product_ids ?? []),
                            };

                            setForm(filled);
                            setOriginalForm(filled);
                        } catch (error) {
                            const status = error.response?.status;
                            if (status === 401) {
                                navigate('/login');
                            } else if (status === 404) {
                                const localLead = await getPendingLeadById(Number(id));
                                if (localLead) {
                                    setLeadSource('local');
                                    const filled = {
                                        full_name: localLead.full_name ?? "",
                                        phone: localLead.phone ?? "",
                                        email: localLead.email ?? "",
                                        company: localLead.company ?? "",
                                        position: localLead.position ?? "",
                                        event_id: localLead.event_id ?? null,
                                        product_ids: localLead.product ?? [],
                                    };
                                    setForm(filled);
                                    setOriginalForm(filled);
                                } else {
                                    alert("Заявка не найдена");
                                    navigate(-1);
                                }
                            } else {
                                alert("Ошибка загрузки заявки");
                                navigate(-1);
                            }
                        }

                    }
                }
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, isEditRoute]);

    useEffect(() => {

        if (isEditRoute) return;

        const draft = location.state?.draft;

        if (draft) {

            setDraftId(draft.id);

            setForm({
                id: draft.id,
                full_name: draft.full_name ?? "",
                phone: draft.phone ?? "",
                email: draft.email ?? "",
                company: draft.company ?? "",
                position: draft.position ?? "",
                event_ids: draft.event_ids ?? [],
                product_ids: draft.product_ids ?? []
            });
        }

        setDraftLoaded(true);

    }, [location.state, isEditRoute]);

    useEffect(() => {
        console.log("AUTOSAVE EFFECT START");

        if (isEditRoute) return;
        if (!draftLoaded) return; // Убедитесь, что draftLoaded устанавливается в true при монтировании для новой формы!

        const timeout = setTimeout(async () => {
            const hasData =
                form.full_name ||
                form.phone ||
                form.email ||
                form.company ||
                form.position ||
                form.event_ids.length > 0 ||
                form.product_ids.length > 0;

            if (!hasData) return;

            // Если по какой-то причине в форме пропал id, генерируем на лету,
            // но лучше починить onChange (см. шаг 2)
            if (!form.id) {
                console.warn("Form id is missing! Generating a new one.");
                form.id = crypto.randomUUID();
            }

            try {
                console.log("DRAFT DATA TO SAVE:", form);
                const savedId = await saveDraft(form);
                console.log("SAVED ID успешно записан:", savedId);
            } catch (error) {
                console.error("DRAFT SAVE ERROR", error);
            }

        }, 2000);

        return () => clearTimeout(timeout);
// Убираем draftId из зависимостей, оставляем только форму
    }, [form, draftLoaded, isEditRoute]);

    useEffect(() => {
        if (isEditRoute) return;

        const draft = location.state?.draft;
        if (draft) {
            setDraftId(draft.id);

            setForm({
                id: draft.id,
                full_name: draft.full_name ?? "",
                phone: draft.phone ?? "",
                email: draft.email ?? "",
                company: draft.company ?? "",
                position: draft.position ?? "",
                event_id: draft.event_id ?? [],
                product_ids: draft.product_ids ?? []
            });
        }

        setDraftLoaded(true);

    }, [location.state, isEditRoute]);

    useEffect(() => {
        console.log("AUTOSAVE EFFECT START");

        if (isEditRoute) return;
        if (!draftLoaded) return; // Убедитесь, что draftLoaded устанавливается в true при монтировании для новой формы!

        const timeout = setTimeout(async () => {
            const hasData =
                form.full_name ||
                form.phone ||
                form.email ||
                form.company ||
                form.position ||
                form.event_id.length > 0 ||
                form.product_ids.length > 0;

            if (!hasData) return;

            // Если по какой-то причине в форме пропал id, генерируем на лету,
            // но лучше починить onChange (см. шаг 2)
            if (!form.id) {
                console.warn("Form id is missing! Generating a new one.");
                form.id = crypto.randomUUID();
            }

            try {
                console.log("DRAFT DATA TO SAVE:", form);
                const savedId = await saveDraft(form);
                console.log("SAVED ID успешно записан:", savedId);
            } catch (error) {
                console.error("DRAFT SAVE ERROR", error);
            }

        }, 2000);

        return () => clearTimeout(timeout);
// Убираем draftId из зависимостей, оставляем только форму
    }, [form, draftLoaded, isEditRoute]);

    const validateForm = () => {
        const newErrors = {
            full_name: validateRequired(form.full_name, "ФИО"),
            phone:     validatePhone(form.phone),
            email:     validateEmail(form.email),
            event_id: validateProduct(form.event_id),
            product:   validateProduct(form.product_ids)
        };
        console.log('validation errors:', newErrors);
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleChange = e => {
        console.log("CHANGE", e.target.name, e.target.value);
        const {name, value} = e.target;

        if (name === "phone") {
            setForm(prev => ({
                ...prev,
                phone: applyPhoneMask(value)
            }));
            return;
        }

        if (name === "full_name") {
            const onlyLetters = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "");
            setForm(prev => ({
                ...prev,
                full_name: onlyLetters
            }));
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductsChange = (e) => {
        const selected = Array.from(
            e.target.selectedOptions,
            option => Number(option.value)
        );

        setForm(prev => ({
            ...prev,
            product_ids: selected
        }));
    };

    const handleEventsChange = (e) => {
        const val = e.target.value;
        setForm(prev => ({ ...prev, event_id: val ? Number(val) : null }));
    };

    const handleCancel = () => {
        if (isEditRoute) {
            setForm(originalForm);
            setErrors({});
            setIsEditing(false);
        } else {
            navigate(-1);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Вы уверены, что хотите удалить этого лида?");
        if (!confirmed) return;

        setSaving(true);
        try {
            if (leadSource === 'local') {
                await deletePendingLead(id);
            }
            else {
                const token = localStorage.getItem("access_token");
                await axios.delete(`/api/leads/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                });
            }
            alert("Lead успешно удален");
            navigate("/dashboard");
        }
        catch (error) {
            console.error("Ошибка при удалении лида:", error.response?.data);
            alert("Ошибка удаления: " + JSON.stringify(error.response?.data || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async e => {
        console.log('id:', id, 'leadSource:', leadSource);


        e.preventDefault();

        if (!validateForm()) return;
        console.log("Отправляем:", JSON.stringify(form, null, 2));

        const payload = {
            full_name:  form.full_name,
            phone:      form.phone,
            email:      form.email,
            company:    form.company,
            position:   form.position,
            event_id:   form.event_id,
            product:    form.product_ids
        };

        setSaving(true);

        try {
            if (isEditRoute) {
                const online = await isServerAvailable();
                console.log('online в handleSubmit:', online);


                if (!online) {
                    if (leadSource === 'local') {
                        await updatePendingLead(Number(id), payload);
                    } else {
                        await addPendingLead({ ...payload, _updateId: id });
                    }
                    alert("Изменения сохранены локально");
                    setOriginalForm(form);
                    setIsEditing(false);
                    return;
                }

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
            } else {
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
            }
        }
        catch (error) {
            
            if (!error.response) {
                await addPendingLead({...payload, _updateId: id});
                alert("Изменения сохранены локально");
                setOriginalForm(form);
                setIsEditing(false);
                return;
            }
            if (!isEditRoute) {
                try {
                    const draftData = {
                        ...form
                    };
                    await saveDraft(draftData);
                } catch (e) {
                    console.error("Failed to save draft", e);
            }
          
            if (error.response?.status === 409) {
                const data = error.response.data;
                const confirmed = window.confirm(
                    `Заявка с таким телефоном и email уже существует.\nОбновить существующую заявку?`
                );
                if (confirmed) {
                    const token = localStorage.getItem("access_token");
                    await axios.put(`/api/leads/${data.existing_lead.id}`, payload, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                            "Idempotency-Key": crypto.randomUUID()
                        }
                    });
                    alert("Заявка обновлена");
                    window.location.href = "/dashboard";
                }
                return;
            }
            console.error("Ошибка:", error.response?.data);
            alert("Ошибка: " + JSON.stringify(error.response?.data));
        } finally {
            setSaving(false);
        }
    };

    const isFormValid =
        form.full_name &&
        !validatePhone(form.phone) &&
        !validateEmail(form.email) &&
        form.event_id &&
        form.product_ids?.length > 0;

    if (loading) return <p>Загрузка...</p>;

    const getEventName =
        (eventId) => events.find(
            (e) => e.id === eventId)?.name ?? eventId;
    const getProductName =
        (productId) => products.find(
            (p) => p.id === productId)?.name ?? productId;

    return (
        <div className="page-container">
            <div className="page-card">

                <div className="page-header">
                    <h2 className="page-title">
                        {isEditRoute ? (isEditing ? "Редактирование заявки" : "Просмотр заявки") : "Новая заявка"}
                    </h2>
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate('/')}
                    >
                        ← Главная
                    </button>
                    {isEditRoute && !isEditing && (
                        <>

                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => setIsEditing(true)}
                                style={{ padding: "8px 20px", cursor: "pointer" }}
                            >
                                Редактировать
                            </button>
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={handleDelete}
                                disabled={saving}
                                style={{ padding: "8px 20px", cursor: "pointer" }}
                            >
                                {saving ? "Удаление..." : "Удалить лид"}
                            </button>
                        </>

                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <Field label="ФИО" error={errors.full_name}>
                        <input
                            className="form-input"
                            type="text"
                            name="full_name"
                            placeholder="ФИО"
                            value={form.full_name}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </Field>

                    <Field label="Телефон" error={errors.phone}>
                        <input
                            className="form-input"
                            type="text"
                            name="phone"
                            placeholder="+7 (___) ___-__-__"
                            value={form.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </Field>

                    <Field label="Email" error={errors.email}>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </Field>

                    <Field label="Компания">
                        <input
                            className="form-input"
                            type="text"
                            name="company"
                            placeholder="Компания"
                            value={form.company}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </Field>

                    <Field label="Должность">
                        <input
                            className="form-input"
                            type="text"
                            name="position"
                            placeholder="Должность (опционально)"
                            value={form.position}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </Field>

                    <Field label="События" error={errors.event_id}>
                        {isEditing ? (
                            <select
                                className="form-select"
                                name="event_id"
                                value={form.event_id ?? ""}
                                onChange={handleEventsChange}
                                style={{ width: "100%", minHeight: 50, padding: 8 }}
                            >
                                <option value="">— выберите событие —</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p style={{ margin: 0 }}>
                                {form.event_id ? getEventName(form.event_id) : "—"}
                            </p>
                        )}
                    </Field>

                    <Field label="Продукты" error={errors.product}>
                        {isEditing ? (
                            <select
                                className="form-select"
                                multiple
                                name="product_ids"
                                value={form.product_ids}
                                onChange={handleProductsChange}
                                style={{ width: "100%", minHeight: 50, padding: 8 }}
                            >
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p style={{ margin: 0 }}>
                                {form.product_ids.length > 0
                                    ? form.product_ids.map(getProductName).join(", ")
                                    : "—"}
                            </p>
                        )}
                    </Field>

                    {isEditing && (
                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={!isFormValid || saving}
                                style={{ padding: "10px 24px", cursor: "pointer" }}
                            >
                                {saving ? "Сохранение..." : "Сохранить"}
                            </button>
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={handleCancel}
                                style={{ padding: "10px 24px", cursor: "pointer" }}
                            >
                                Отмена
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="form-group">
            <label className="form-label">
                {label}
            </label>
            {children}
            {error &&
                <p className="form-error">
                    {error}
                </p>
            }
        </div>
    );
}
import { useEffect, useState } from "react";
import axios from "axios";
import {
    validateRequired,
    validateEmail,
    validatePhone,
    validateProduct,
    applyPhoneMask
} from "../../utils/validators";

export default function LeadFormPage() {

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        event_ids: [],
        product_ids: []
    });

    const [events, setEvents] = useState([]);
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem("access_token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            };

            const eventsRes = await axios.get(
                "/api/events",
                config
            );

            const productsRes = await axios.get(
                "/api/products",
                config
            );

            setEvents(eventsRes.data.events || []);
            setProducts(productsRes.data.products || []);
            console.log("EVENTS:", eventsRes.data);
            console.log("PRODUCTS:", productsRes.data);

        } catch (error) {
            console.error("Ошибка загрузки данных", error);

            if (error.response?.status === 401) {
                alert("Сессия истекла. Войдите снова.");
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    };

    const validateForm = () => {
        const newErrors = {
            full_name: validateRequired(form.full_name, "ФИО"),
            phone:     validatePhone(form.phone),
            email:     validateEmail(form.email),
            event_ids: validateProduct(form.event_ids),
            product:   validateProduct(form.product_ids)
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };


    const handleChange = e => {
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
        const selected = Array.from(
            e.target.selectedOptions,
            option => Number(option.value)
        );

        setForm(prev => ({
            ...prev,
            event_ids: selected
        }));
    };


    const handleSubmit = async e => {

        e.preventDefault();

        if (!validateForm()) return;
        console.log("Отправляем:", JSON.stringify(form, null, 2));

        try {
            const token = localStorage.getItem("access_token");

            const payload = {
                full_name:  form.full_name,
                phone:      form.phone,
                email:      form.email,
                company:    form.company,
                position:   form.position,
                event_id:   form.event_ids[0],
                product:    form.product_ids
            };

            await axios.post("/api/leads", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Idempotency-Key": crypto.randomUUID()
                }
            });

            alert("Lead успешно создан");
            window.location.href = "/dashboard";
        } catch (error) {
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
        }
    };

    const isFormValid =
        form.full_name &&
        !validatePhone(form.phone) &&
        !validateEmail(form.email) &&
        form.event_ids?.length > 0 &&
        form.product_ids?.length > 0;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Форма заявки</h2>

            <div>
                <input
                    type="text"
                    name="full_name"
                    placeholder="ФИО"
                    value={form.full_name}
                    onChange={handleChange}
                />
                {errors.full_name && <p>{errors.full_name}</p>}
            </div>

            <div>
                <input
                    type="text"
                    name="phone"
                    placeholder="+7 (___) ___-__-__"
                    value={form.phone}
                    onChange={handleChange}
                />
                {errors.phone && <p>{errors.phone}</p>}
            </div>

            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <p>{errors.email}</p>}
            </div>

            <div>
                <input
                    type="text"
                    name="company"
                    placeholder="Компания"
                    value={form.company}
                    onChange={handleChange}
                />
            </div>

            <div>
                <input
                    type="text"
                    name="position"
                    placeholder="Должность (опционально)"
                    value={form.position}
                    onChange={handleChange}
                />
            </div>

            <div>
                <select
                    multiple
                    name="event_ids"
                    value={form.event_ids}
                    onChange={handleEventsChange}
                    style={{
                        width: "250px",
                        minHeight: "120px",
                        padding: "8px",
                        fontSize: "16px"
                    }}
                >
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.name}
                        </option>
                    ))}
                </select>

                {errors.event_ids && <p>{errors.event_ids}</p>}
            </div>

            <div>
                <select
                    multiple
                    name="product_ids"
                    value={form.product_ids}
                    onChange={handleProductsChange}
                    style={{
                        width: "250px",
                        minHeight: "120px",
                        padding: "8px",
                        fontSize: "16px"
                    }}
                >
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>

                {errors.product && <p>{errors.product}</p>}
            </div>

            <button type="button" onClick={handleSubmit}>Save</button>
        </form>
    );
}
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getManager,
    createManager,
    updateManager,
    deleteManager
} from '../../../services/adminManagersService';
import {
    validateEmail,
    validatePhone,
    validateRequired,
    applyPhoneMask
} from "../../../utils/validators.js";
function ManagerForm() {

    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    useEffect(() => {
        if (isEdit) {
            loadManager();
        }
    }, [isEdit, id]);

    async function loadManager() {
        try {
            const manager = await getManager(id);

            setFormData({
                name: manager.name,
                email: manager.email,
                phone: manager.phone,
                password: '',
            });
        }
        catch (error) {
            console.error(error);
            alert('Не удалось загрузить менеджера');
        }
    }

    function handleChange(event) {

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if (fieldName === "name") {
            setFormData(prevData => ({
                ...prevData,
                name: fieldValue.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "")
            }));
            return;
        }

        if (fieldName === "phone") {
            setFormData(prevData => ({
                ...prevData,
                phone: applyPhoneMask(fieldValue)
            }));
            return;
        }

        setFormData(prevData => ({
            ...prevData,
            [fieldName]: fieldValue,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) return;

        try {
            if (isEdit) {
                await updateManager(id, formData);
            }
            else {
                await createManager(formData);
            }

            navigate('/admin/managers');
        }
        catch (error) {
            console.error(error);
            alert('Ошибка сохранения');
        }
    }

    async function handleDelete() {

        const confirmed = window.confirm('Удалить менеджера?');
        if (!confirmed) return;

        try {
            await deleteManager(id);
            alert('Менеджер удалён');
            navigate('/admin/managers');
        }
        catch (error) {
            console.error(error);
            alert('Ошибка удаления');
        }
    }
    const validateForm = () => {
        const newErrors = {
            name: validateRequired(formData.name, "Имя"),
            phone:     validatePhone(formData.phone),
            email:     validateEmail(formData.email),
            password:
                !isEdit && !formData.password
                    ? "Введите пароль"
                    : "",
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const isFormValid =
        formData.name &&
        !validatePhone(formData.phone) &&
        !validateEmail(formData.email);

    return (
        <div className="page-container">
            <div className="page-card">

                <div className="page-header">
                    <h1 className="page-title">
                        {isEdit
                            ? 'Редактирование менеджера'
                            : 'Создание менеджера'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" >

                    <Field label="Имя" error={errors.name}>
                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            autoComplete="new-password"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="Email" error={errors.email}>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            autoComplete="new-password"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="Телефон" error={errors.phone}>
                        <input
                            className="form-input"
                            type="text"
                            name="phone"
                            autoComplete="new-password"
                            value={formData.phone}
                            placeholder="+7 (___) ___-__-__"
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="Пароль" error={errors.password}>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEdit}
                            placeholder={
                                isEdit
                                    ? 'Оставьте пустым, чтобы не менять пароль'
                                    : ''
                            }
                        />
                    </Field>

                    <div className="form-actions">

                        <button
                            className="btn btn-primary"
                            type="submit" disabled={!isFormValid}
                        >
                            Сохранить
                        </button>
                        {
                            isEdit && (
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    Удалить менеджера
                                </button>
                            )
                        }
                    </div>
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
export default ManagerForm;
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} from '../../../services/adminEventsService';

function EventForm() {

    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        event_date: '',
        end_date: '',
        is_active: true,
    });

    useEffect(() => {
        if (isEdit) {
            loadEvent();
        }
    }, [id]);

    async function loadEvent() {
        try {
            const event = await getEvent(id);

            setFormData({
                name: event.name,
                description: event.description,
                event_date: event.event_date,
                end_date: event.end_date ?? '',
                is_active: event.is_active,
            });
        }
        catch (error) {
            console.error(error);
            alert('Не удалось загрузить событие');
        }
    }

    function handleChange(event) {

        const fieldName = event.target.name;
        const fieldValue =
            event.target.type === 'checkbox'
                ? event.target.checked
                : event.target.value;

        const today = new Date().toISOString().split('T')[0];

        if ((fieldName === 'event_date' || fieldName === 'end_date') && fieldValue < today) {
            alert('Дата не может быть меньше текущей');
            return;
        }

        const newFormData = {
            ...formData,
            [fieldName]: fieldValue,
        };

        if (newFormData.event_date && newFormData.end_date && newFormData.event_date > newFormData.end_date) {
            alert('Дата начала не может быть позже даты окончания');
            return;
        }

        setFormData(newFormData);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            if (isEdit) {
                await updateEvent(id, formData);
            }
            else {
                await createEvent(formData);
            }

            navigate('/admin/events');
        }
        catch (error) {
            console.error(error);
            alert('Ошибка сохранения');
        }
    }
    async function handleDelete() {

        const confirmed = window.confirm('Удалить событие?');
        if (!confirmed) return;

        try {
            await deleteEvent(id);
            navigate('/admin/events');
        }
        catch (error) {
            console.error(error);
            alert('Ошибка удаления');
        }
    }

    return (
        <div className="page-container">
            <div className="page-card">

                <div className="page-header">
                    <h1 className="page-title">
                        {isEdit
                            ? 'Редактирование события'
                            : 'Создание события'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>

                    <Field label="Название" error={errors.name}>
                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="Описание" error={errors.description}>
                        <input
                            className="form-input"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Field>

                    <Field label="Дата начала" error={errors.event_date}>
                        <input
                            className="form-input"
                            type="date"
                            name="event_date"
                            value={formData.event_date}
                            onChange={handleChange}
                        />
                    </Field>

                    <Field label="Дата окончания" error={errors.end_date}>
                        <input
                            className="form-input"
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            min={formData.event_date || new Date().toISOString().split('T')[0]}
                        />
                    </Field>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />

                            Активен
                        </label>
                    </div>

                    <div className="form-actions">

                        <button
                            className="btn btn-primary"
                            type="submit"
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
                                    Удалить событие
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
export default EventForm;
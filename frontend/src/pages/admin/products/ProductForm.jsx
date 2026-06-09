import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from '../../../services/adminProductsService';

function ProductForm() {

    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        is_active: true,
    });

    useEffect(() => {
        if (isEdit) {
            loadProduct();
        }
    }, [id]);

    async function loadProduct() {
        try {
            const product = await getProduct(id);

            setFormData({
                name: product.name,
                is_active: product.is_active,
            });
        }
        catch (error) {
            console.error(error);
            alert('Не удалось загрузить продукт');
        }
    }

    function handleChange(event) {

        const fieldName = event.target.name;
        const fieldValue =
            event.target.type === 'checkbox'
                ? event.target.checked
                : event.target.value;

        setFormData(prevData => ({
            ...prevData,
            [fieldName]: fieldValue,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            if (isEdit) {
                await updateProduct(id, formData);
            }
            else {
                await createProduct(formData);
            }

            navigate('/admin/products');
        }
        catch (error) {
            console.error(error);
            alert('Ошибка сохранения');
        }
    }
    async function handleDelete() {

        const confirmed = window.confirm('Удалить продукт?');
        if (!confirmed) return;

        try {
            await deleteProduct(id);

            navigate('/admin/products');
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
                            ? 'Редактирование продукта'
                            : 'Создание продукта'}
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
                                    Удалить продукт
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

export default ProductForm;
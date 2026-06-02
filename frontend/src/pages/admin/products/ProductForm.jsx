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
        <div>
            <h1>
                {isEdit
                    ? 'Редактирование продукта'
                    : 'Создание продукта'}
            </h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Название</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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

                <button type="submit">
                    Сохранить
                </button>
                {
                    isEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            style={{
                                marginLeft: '10px',
                                backgroundColor: '#d9534f',
                                color: 'white'
                            }}
                        >
                            Удалить продукт
                        </button>
                    )}
            </form>
        </div>
    );
}

export default ProductForm;
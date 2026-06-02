import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../../services/adminProductsService';

function ProductsTable() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const data = await getProducts();

        setProducts(data);
    }

    return (
        <div>
            <h1>Products</h1>
            <button
                type="button"
                onClick={() => navigate('/admin')}
            >
                ← Главная
            </button>
            <button
                onClick={() => navigate('/admin/products/create')}
            >
                Add Product
            </button>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Active</th>
                </tr>
                </thead>

                <tbody>
                {products.map(product => (
                    <tr
                        key={product.id}
                        onClick={() =>
                            navigate(
                                `/admin/products/${product.id}/edit`
                            )
                        }
                    >
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.is_active ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductsTable;
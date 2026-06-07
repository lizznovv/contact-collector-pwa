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
        <div className="dashboard-container">
            <h1 className="page-title">
                Products
            </h1>

            <div className="dashboard-actions">
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => navigate('/admin')}
                >
                    ← Главная
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/products/create')}
                >
                    Add Product
                </button>
            </div>

            <div className="table-wrapper">

                <table className="table">
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
                                className="table-row-clickable"
                                key={product.id}
                                onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                            >
                                <span>
                                    <td data-label="ID">{product.id}</td>
                                    <td data-label="Name">{product.name}</td>
                                    <td data-label="Active">{product.is_active ? 'Yes' : 'No'}</td>
                                </span>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductsTable;
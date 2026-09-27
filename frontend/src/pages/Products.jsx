import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api from "../api/axiosInstance.js";
import { useAuthContext } from "../context/AuthContext.jsx";

const formatPrice = (price) => `₹${Math.round(price).toLocaleString("en-IN")}`;

export default function Products() {
  const { user } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete product.");
    }
  }

  if (loading)
    return (
      <div className="status-text">
        <div className="spinner" />
        Loading products...
      </div>
    );
  if (error) return <p className="status-text form-error">{error}</p>;

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h2>Products</h2>
          <p className="products-count">
            {products.length} item{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        {user && (
          <Link to="/products/new" className="btn-primary">
            <Plus size={16} aria-hidden="true" />
            Add Product
          </Link>
        )}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <p>No products yet.</p>
          {user && (
            <Link to="/products/new" className="btn-primary">
              Add your first product
            </Link>
          )}
        </div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-avatar">
              {product.name.charAt(0).toUpperCase()}
            </div>
            <h3>{product.name}</h3>
            <p className="product-description">
              {product.description || "No description provided."}
            </p>
            <div className="product-meta">
              <p className="product-price">{formatPrice(product.price)}</p>
              <span
                className={`stock-badge ${product.stock === 0 ? "low" : ""}`}
              >
                {product.stock === 0
                  ? "Out of stock"
                  : `${product.stock} in stock`}
              </span>
            </div>

            {user && (
              <div className="product-actions">
                <Link
                  to={`/products/${product._id}/edit`}
                  className="product-action-button"
                >
                  <Pencil size={15} aria-hidden="true" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="product-action-button danger"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

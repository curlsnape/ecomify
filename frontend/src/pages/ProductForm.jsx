import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../api/axiosInstance.js";

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    async function loadProduct() {
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({
          name: data.product.name,
          description: data.product.description || "",
          price: data.product.price,
          stock: data.product.stock,
        });
      } catch (err) {
        setFormError("Could not load this product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, isEditMode]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/");
    } catch (err) {
      const response = err.response;

      if (response?.status === 400 && Array.isArray(response.data?.errors)) {
        const errorsByField = {};
        response.data.errors.forEach((e) => {
          errorsByField[e.path || e.param] = e.msg;
        });
        setFieldErrors(errorsByField);
      } else {
        setFormError(
          response?.data?.message || "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="status-text">Loading product...</p>;

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <Link to="/" className="form-back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to products
        </Link>
        <h2>{isEditMode ? "Edit Product" : "Add Product"}</h2>

        {formError && <p className="form-error">{formError}</p>}

        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
          {fieldErrors.name && (
            <span className="field-error">{fieldErrors.name}</span>
          )}
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
          {fieldErrors.description && (
            <span className="field-error">{fieldErrors.description}</span>
          )}
        </label>

        <label>
          Price
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
          />
          {fieldErrors.price && (
            <span className="field-error">{fieldErrors.price}</span>
          )}
        </label>

        <label>
          Stock
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
          />
          {fieldErrors.stock && (
            <span className="field-error">{fieldErrors.stock}</span>
          )}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Product"}
        </button>
      </form>
    </div>
  );
}

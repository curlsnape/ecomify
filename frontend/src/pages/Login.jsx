import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.js";
import { useAuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { setUser, setAccessToken } = useAuthContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      const { data } = await api.post("/auth/login", form);
      setAccessToken(data.accessToken);
      setUser(data.user);
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

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {formError && <p className="form-error">{formError}</p>}

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          {fieldErrors.email && (
            <span className="field-error">{fieldErrors.email}</span>
          )}
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password}</span>
          )}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Moon, ShoppingBag, Sun } from "lucide-react";
import api from "../api/axiosInstance.js";
import { useAuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, setUser, setAccessToken } = useAuthContext();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem("theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
      navigate("/login");
    }
  }

  function handleThemeToggle() {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <ShoppingBag size={18} aria-hidden="true" />
        </span>
        <span>ECOMIFY</span>
      </Link>
      <div className="nav-links">
        <button
          type="button"
          className="theme-toggle"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon size={18} aria-hidden="true" />
          ) : (
            <Sun size={18} aria-hidden="true" />
          )}
        </button>
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button onClick={handleLogout} className="nav-logout">
              <LogOut size={16} aria-hidden="true" />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <NavLink to="/register" className="nav-register">
              Create account
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

import { Navigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext.jsx"

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuthContext()

    if (loading) {
        return <p className="status-text">Checking session...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

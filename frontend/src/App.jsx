import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthProvider from "./context/AuthContext.jsx"
import Navbar from "./components/Navbar.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Products from "./pages/Products.jsx"
import ProductForm from "./pages/ProductForm.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <main className="page-container">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Products />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/products/new"
                            element={
                                <ProtectedRoute>
                                    <ProductForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/products/:id/edit"
                            element={
                                <ProtectedRoute>
                                    <ProductForm />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </AuthProvider>
        </BrowserRouter>
    )
}
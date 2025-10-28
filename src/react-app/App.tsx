import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/react-app/hooks/useAuth";
import HomePage from "@/react-app/pages/Home";
import ProductsPage from "@/react-app/pages/Products";
import ProductDetailPage from "@/react-app/pages/ProductDetail";
import AdminPage from "@/react-app/pages/Admin";
import LoginPage from "@/react-app/pages/Login";
import ProtectedRoute from "@/react-app/components/ProtectedRoute";
import InstallPrompt from "@/react-app/components/InstallPrompt";
import OfflineIndicator from "@/react-app/components/OfflineIndicator";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <InstallPrompt />
        <OfflineIndicator />
      </Router>
    </AuthProvider>
  );
}

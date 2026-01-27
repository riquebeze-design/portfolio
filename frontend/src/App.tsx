import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WorksPage from "./pages/WorksPage";
import WorkDetailPage from "./pages/WorkDetailPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminWorksPage from "./pages/admin/AdminWorksPage";
import AdminWorkFormPage from "./pages/admin/AdminWorkFormPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AdminLayout from "./components/AdminLayout";
import PublicLayout from "./components/PublicLayout";

const queryClient = new QueryClient();

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Index />} />
              <Route path="trabalhos" element={<WorksPage />} />
              <Route path="trabalhos/:slug" element={<WorkDetailPage />} />
              <Route path="contato" element={<ContactPage />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="works" element={<AdminWorksPage />} />
              <Route path="works/new" element={<AdminWorkFormPage />} />
              <Route path="works/edit/:id" element={<AdminWorkFormPage />} />
              <Route path="leads" element={<AdminLeadsPage />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
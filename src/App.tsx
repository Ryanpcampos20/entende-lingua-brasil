
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthProvider as SupabaseAuthProvider } from "@/hooks/useSupabaseAuth";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import MatchingPage from "./pages/partners/MatchingPage";
import { ProductsPage } from "./pages/business/ProductsPage";
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Blog from "./pages/Blog";
import { CompaniesSearch } from "./pages/business/CompaniesSearch";
import { QuotesPage } from "./pages/business/QuotesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/partners/matching" element={<MatchingPage />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/business/products" element={<ProductsPage />} />
              <Route path="/business/companies" element={<CompaniesSearch />} />
              <Route path="/business/quotes" element={<QuotesPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin" element={<AdminLogin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;

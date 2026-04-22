import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PaymentPage from "./pages/PaymentPage";
import ReviewPage from "./pages/ReviewPage";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from './pages/Auth';
import HexaHomePage from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from './pages/Productpage';
import CartPage from "./pages/Cart";  
import CheckoutAddress from "./pages/CheckoutAddress";
import ShippingStep from "./pages/ShippingStep";
import OrderSummary1 from "./pages/OrderSummary";
import OrderSuccess from "./pages/OrderSuccess";
import About from "./pages/About";
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AvatarProvider } from './context/AvatarContext';
import AdminUsers from "./pages/AdminUsers";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogistics from "./pages/AdminLogistics";
import AdminSales from "./pages/AdminSales";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCharts from "./pages/AdminCharts";
import AdminInventory from "./pages/AdminInventory";

import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="hexal-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AvatarProvider>
            <CartProvider>
              <ProductProvider>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HexaHomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/address" element={<CheckoutAddress />} />
                    <Route path="/checkout/shipping" element={<ShippingStep />} />
                    <Route path="/order-summary" element={<OrderSummary1 />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/review" element={<ReviewPage />} />
                  </Route>
                  
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/logistics" element={<AdminLogistics />} />
                    <Route path="/admin/sales" element={<AdminSales />} />
                    <Route path="/admin/customers" element={<AdminCustomers />} />
                    <Route path="/admin/charts" element={<AdminCharts />} />
                    <Route path="/admin/inventory" element={<AdminInventory />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ProductProvider>
            </CartProvider>
          </AvatarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
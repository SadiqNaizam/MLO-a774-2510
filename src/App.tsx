import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Using Sonner for different style/position if needed
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Page Components
import HomePageRestaurantListingPage from "./pages/HomePageRestaurantListingPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists in src/pages/

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePageRestaurantListingPage />} />
          <Route path="/restaurants" element={<HomePageRestaurantListingPage />} /> {/* Alias for home/listing */}
          <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:orderId/status" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<OrderTrackingPage />} /> {/* For general order history view */}
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster /> {/* For shadcn toasts */}
      <Sonner richColors position="top-right" /> {/* For Sonner notifications */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
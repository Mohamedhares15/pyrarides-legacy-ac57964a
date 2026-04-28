import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteLayout } from "@/components/shared/SiteLayout";
import Index from "./pages/Index";
import Stables from "./pages/Stables";
import StableDetail from "./pages/StableDetail";
import Packages from "./pages/Packages";
import Booking from "./pages/Booking";
import Checkout from "./pages/Checkout";
import Training from "./pages/Training";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/stables" element={<Stables />} />
            <Route path="/stables/:id" element={<StableDetail />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<Packages />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/training" element={<Training />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

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
import PackageDetail from "./pages/PackageDetail";
import Booking from "./pages/Booking";
import Checkout from "./pages/Checkout";
import CheckoutPackage from "./pages/CheckoutPackage";
import Training from "./pages/Training";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminGlobal from "./pages/dashboards/AdminGlobal";
import CaptainDashboard from "./pages/dashboards/CaptainDashboard";
import DriverDashboard from "./pages/dashboards/DriverDashboard";
import CXMediaDashboard from "./pages/dashboards/CXMediaDashboard";
import AdminHorses from "./pages/AdminHorses";
import AdminSchedule from "./pages/AdminSchedule";
import AdminAnalytics from "./pages/AdminAnalytics";
import Reviews from "./pages/Reviews";
import Cercle from "./pages/Cercle";
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
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/package/:id" element={<CheckoutPackage />} />
            <Route path="/training" element={<Training />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/cercle" element={<Cercle />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/captain" element={<CaptainDashboard />} />
            <Route path="/dashboard/driver" element={<DriverDashboard />} />
            <Route path="/dashboard/cx-media" element={<CXMediaDashboard />} />
            <Route path="/dashboard/admin" element={<AdminGlobal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/horses" element={<AdminHorses />} />
            <Route path="/admin/schedule" element={<AdminSchedule />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

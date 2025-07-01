import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationHeader from "./components/NavigationHeader";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import CalorieCalculator from "./components/CalorieCalculator";
import MotivationalBlog from "./components/MotivationalBlog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calculadora" element={<div className="py-8"><CalorieCalculator /></div>} />
          <Route path="/painel" element={<Dashboard />} />
          <Route path="/receitas" element={<Recipes />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="/blog" element={<div className="py-8"><MotivationalBlog /></div>} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

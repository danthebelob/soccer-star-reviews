
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MatchDetails from "./pages/MatchDetails";
import NotFound from "./pages/NotFound";
import Partidas from "./pages/Partidas";
import MaisVotados from "./pages/MaisVotados";
import AoVivo from "./pages/AoVivo";
import Comunidade from "./pages/Comunidade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matches/:id" element={<MatchDetails />} />
          <Route path="/partidas" element={<Partidas />} />
          <Route path="/mais-votados" element={<MaisVotados />} />
          <Route path="/ao-vivo" element={<AoVivo />} />
          <Route path="/comunidade" element={<Comunidade />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

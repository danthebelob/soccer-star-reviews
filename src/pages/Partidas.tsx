
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchLeagues } from "@/integrations/api/matches";
import { Match } from "@/components/MatchCard";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Filter, SortDesc, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/use-toast";

// Define the sports options
const sportsOptions = [
  { id: 'basketball', name: 'Basquete', emoji: '🏀', leagueId: 12 },
  { id: 'soccer', name: 'Futebol', emoji: '⚽', leagueId: 39 },
  { id: 'baseball', name: 'Beisebol', emoji: '⚾', leagueId: 1 },
  { id: 'hockey', name: 'Hockey', emoji: '🏒', leagueId: 57 },
  { id: 'american_football', name: 'Futebol Americano', emoji: '🏈', leagueId: 1 }
];

const Partidas = () => {
  // Iniciar com basquete como padrão
  const [selectedSport, setSelectedSport] = useState(sportsOptions[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: matches, isLoading, error, refetch } = useQuery({
    queryKey: ["matches", selectedSport.id, selectedSport.leagueId],
    queryFn: async () => {
      try {
        const result = await fetchMatches("all", 20, undefined, undefined, selectedSport.id, selectedSport.leagueId);
        return result;
      } catch (err) {
        console.error("Erro ao buscar partidas:", err);
        toast({
          title: "Erro ao carregar partidas",
          description: "Não foi possível buscar as partidas. Tente novamente mais tarde.",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  const handleSportChange = (sport: typeof sportsOptions[0]) => {
    setSelectedSport(sport);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Atualizado",
        description: `As partidas de ${selectedSport.name} foram atualizadas.`
      });
    } catch (err) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar as partidas. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container py-8 mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Partidas</h1>
          <div className="flex justify-between mb-6">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="w-4 h-4" /> Esporte
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sportsOptions.map((sport) => (
                    <DropdownMenuItem key={sport.id} onClick={() => handleSportChange(sport)}>
                      <span className="mr-2">{sport.emoji}</span> {sport.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="w-4 h-4" /> Data
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <SortDesc className="w-4 h-4" /> Ordenar
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            <span className="mr-2">{selectedSport.emoji}</span>
            Partidas de {selectedSport.name}
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
        
        <div className="flex justify-between mb-6">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="w-4 h-4" /> Esporte
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sportsOptions.map((sport) => (
                  <DropdownMenuItem key={sport.id} onClick={() => handleSportChange(sport)}>
                    <span className="mr-2">{sport.emoji}</span> {sport.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="w-4 h-4" /> Data
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <SortDesc className="w-4 h-4" /> Ordenar
          </Button>
        </div>

        {matches?.length === 0 ? (
          <div className="p-8 text-center bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-600">Nenhuma partida encontrada para {selectedSport.name}</p>
            <p className="mt-2 text-gray-500">Tente selecionar outro esporte ou verifique mais tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches?.map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Partidas;

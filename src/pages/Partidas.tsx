
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches, fetchLeagues, fetchTeams } from "@/integrations/api/matches";
import { Match } from "@/components/MatchCard";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Filter, 
  SortDesc, 
  ChevronDown, 
  RefreshCw,
  Search,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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

// Define seasons options (last 5 years)
const currentYear = new Date().getFullYear();
const seasonOptions = Array.from({ length: 5 }, (_, i) => ({
  value: `${currentYear - i}`,
  label: `${currentYear - i}`
}));

const Partidas = () => {
  // Iniciar com basquete como padrão
  const [selectedSport, setSelectedSport] = useState(sportsOptions[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [season, setSeason] = useState(seasonOptions[0].value);
  const [teams, setTeams] = useState<Array<{ id: string, name: string, logo: string }>>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch matches with all filters
  const { data: matches, isLoading: matchesLoading, error: matchesError, refetch: refetchMatches } = useQuery({
    queryKey: ["matches", selectedSport.id, selectedSport.leagueId, season, selectedTeam],
    queryFn: async () => {
      try {
        console.log(`Fetching matches with filters: sport=${selectedSport.id}, league=${selectedSport.leagueId}, season=${season}, team=${selectedTeam}`);
        const result = await fetchMatches(
          "all", 
          20, 
          undefined, 
          undefined, 
          selectedSport.id, 
          selectedSport.leagueId,
          season,
          selectedTeam
        );
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

  // Fetch teams for the current sport/league
  const { data: teamsList, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams", selectedSport.id, selectedSport.leagueId, season],
    queryFn: async () => {
      try {
        const result = await fetchTeams(selectedSport.id, selectedSport.leagueId, season);
        return result;
      } catch (err) {
        console.error("Erro ao buscar times:", err);
        return [];
      }
    },
    enabled: !!selectedSport && !!season
  });

  // Update teams list when teamsList changes
  useEffect(() => {
    if (teamsList && teamsList.length > 0) {
      setTeams(teamsList);
    }
  }, [teamsList]);

  // Reset selected team when sport changes
  useEffect(() => {
    setSelectedTeam(null);
  }, [selectedSport]);

  const handleSportChange = (sport: typeof sportsOptions[0]) => {
    setSelectedSport(sport);
  };

  const handleSeasonChange = (value: string) => {
    setSeason(value);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId === selectedTeam ? null : teamId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchMatches();
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

  // Filter matches by search query
  const filteredMatches = matches?.filter(match => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      match.homeTeam.name.toLowerCase().includes(query) ||
      match.awayTeam.name.toLowerCase().includes(query) ||
      match.competition.toLowerCase().includes(query)
    );
  });

  if (matchesLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container py-8 mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Partidas</h1>
          <div className="flex flex-wrap gap-3 mb-6">
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
            
            <Select value={season} onValueChange={handleSeasonChange}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Temporada" />
              </SelectTrigger>
              <SelectContent>
                {seasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar por time ou liga..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="h-9 pr-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-9 w-9 p-0"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="gap-1 ml-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
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
        
        <div className="flex flex-wrap gap-3 mb-6">
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
          
          <Select value={season} onValueChange={handleSeasonChange}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Temporada" />
            </SelectTrigger>
            <SelectContent>
              {seasonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar por time ou liga..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-9 pr-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-9 w-9 p-0"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {teams && teams.length > 0 && (
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {teams.map((team) => (
                <Button
                  key={team.id}
                  variant={selectedTeam === team.id ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={() => handleTeamChange(team.id)}
                >
                  {team.logo && (
                    <img src={team.logo} alt={team.name} className="w-4 h-4 object-contain" />
                  )}
                  {team.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {filteredMatches?.length === 0 ? (
          <div className="p-8 text-center bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-600">Nenhuma partida encontrada para {selectedSport.name}</p>
            <p className="mt-2 text-gray-500">Tente selecionar outra temporada, time ou esporte.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMatches?.map((match: Match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Partidas;

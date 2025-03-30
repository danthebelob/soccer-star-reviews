
import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "@/integrations/api/matches";
import { Match } from "@/components/MatchCard";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AoVivo = () => {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches", "live"],
    queryFn: () => fetchMatches("live", 10),
  });

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <Radio className="w-6 h-6 text-red-500 animate-pulse" />
          <h1 className="text-3xl font-bold">Ao Vivo</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <Radio className="w-6 h-6 text-red-500" />
          <h1 className="text-3xl font-bold">Ao Vivo</h1>
        </div>
        <div className="p-4 text-red-500 bg-red-100 rounded-md">
          Erro ao carregar partidas. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center mb-6 gap-2">
        <Radio className="w-6 h-6 text-red-500 animate-pulse" />
        <h1 className="text-3xl font-bold">Ao Vivo</h1>
        <Badge variant="outline" className="ml-2 bg-red-100 text-red-600 animate-pulse">
          AO VIVO
        </Badge>
      </div>
      
      <p className="mb-6 text-gray-600">
        Acompanhe as partidas que estão acontecendo agora e receba atualizações em tempo real.
      </p>

      {matches?.length === 0 ? (
        <div className="p-8 text-center bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">Não há partidas ao vivo no momento.</p>
          <p className="mt-2 text-gray-500">Volte mais tarde para ver as partidas em andamento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches?.map((match: Match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AoVivo;

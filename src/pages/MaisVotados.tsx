
import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "@/integrations/api/matches";
import { Match } from "@/integrations/supabase/types";
import { MatchCard } from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

const MaisVotados = () => {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches", "trending"],
    queryFn: () => fetchMatches({ type: "trending", limit: 9 }),
  });

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Mais Votados</h1>
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
          <Star className="w-6 h-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Mais Votados</h1>
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
        <Star className="w-6 h-6 text-yellow-500" />
        <h1 className="text-3xl font-bold">Mais Votados</h1>
      </div>
      
      <p className="mb-6 text-gray-600">
        As partidas mais bem avaliadas pela nossa comunidade. Rankings baseados nas avaliações dos usuários.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches?.map((match: Match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default MaisVotados;

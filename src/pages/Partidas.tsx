
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "@/integrations/api/matches";
import { Match } from "@/components/MatchCard";
import MatchCard from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Filter, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";

const Partidas = () => {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: () => fetchMatches("all", 20),
  });

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Partidas</h1>
        <div className="flex justify-between mb-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="w-4 h-4" /> Filtrar
            </Button>
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
    );
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Partidas</h1>
        <div className="p-4 text-red-500 bg-red-100 rounded-md">
          Erro ao carregar partidas. Por favor, tente novamente mais tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Partidas</h1>
      
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="w-4 h-4" /> Filtrar
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="w-4 h-4" /> Data
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <SortDesc className="w-4 h-4" /> Ordenar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches?.map((match: Match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default Partidas;

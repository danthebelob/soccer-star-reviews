
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Match } from "@/components/MatchCard";

// Define types for match data from API
export interface ApiMatch {
  id: string;
  homeTeam: {
    id?: string;
    name: string;
    logo: string;
    score: number;
  };
  awayTeam: {
    id?: string;
    name: string;
    logo: string;
    score: number;
  };
  date: string;
  time: string;
  competition: string;
  competitionLogo?: string;
  isLive?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  highlightsUrl?: string;
}

export interface MatchDetails extends Omit<ApiMatch, 'competition'> {
  competition: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
  };
  status: string;
  venue?: {
    stadium?: string;
    city?: string;
    country?: string;
  };
  season?: string;
  stage?: string;
  round?: string;
  reviews?: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user?: {
      id: string;
      username?: string;
      avatar?: string;
    };
  }[];
}

// Convert API match data to component Match type
export const apiMatchToComponentMatch = (apiMatch: ApiMatch): Match => {
  return {
    id: apiMatch.id,
    homeTeam: {
      name: apiMatch.homeTeam.name,
      logo: apiMatch.homeTeam.logo,
      score: apiMatch.homeTeam.score
    },
    awayTeam: {
      name: apiMatch.awayTeam.name,
      logo: apiMatch.awayTeam.logo,
      score: apiMatch.awayTeam.score
    },
    date: apiMatch.date,
    time: apiMatch.time,
    competition: apiMatch.competition,
    isLive: apiMatch.isLive,
    rating: apiMatch.rating,
    reviewCount: apiMatch.reviewCount,
    tags: apiMatch.tags
  };
};

// Fetch matches from Supabase edge function
export const fetchMatches = async (
  type: 'all' | 'featured' | 'live' | 'upcoming' | 'trending' = 'all',
  limit: number = 10,
  competition_id?: string,
  status?: string
): Promise<Match[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-matches', {
      body: { type, limit, competition_id, status, useApi: true }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.success && data?.data) {
      return data.data.map((match: ApiMatch) => apiMatchToComponentMatch(match));
    }

    return [];
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao buscar partidas. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
    return [];
  }
};

// Fetch a single match by ID
export const fetchMatchById = async (id: string): Promise<MatchDetails | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-match-details', {
      body: { id }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.success && data?.data) {
      return data.data as MatchDetails;
    }

    return null;
  } catch (error: any) {
    console.error(`Error fetching match ${id}:`, error);
    toast({
      title: 'Erro',
      description: 'Falha ao buscar detalhes da partida. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
    return null;
  }
};

// Initialize database with sample data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-football-data', {
      body: { action: 'initialize' }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.success) {
      toast({
        title: 'Sucesso',
        description: 'Banco de dados inicializado com dados de partidas de futebol!'
      });
      return true;
    }

    return false;
  } catch (error: any) {
    console.error('Error initializing database:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao inicializar o banco de dados. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
    return false;
  }
};

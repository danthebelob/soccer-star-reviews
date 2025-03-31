
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
  sportType?: string;
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
  sportType?: string;
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

// Define team interface
export interface Team {
  id: string;
  name: string;
  logo: string;
  country?: string;
  sport_type?: string;
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
    sportType: apiMatch.sportType || 'basketball',
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
  status?: string,
  sport: string = 'basketball',
  league: number = 12,
  season: string = '2023',
  team_id?: string | null
): Promise<Match[]> => {
  try {
    console.log(`Fetching matches: type=${type}, sport=${sport}, league=${league}, season=${season}, team=${team_id}`);
    
    const { data, error } = await supabase.functions.invoke('get-matches', {
      body: { 
        type, 
        limit, 
        competition_id, 
        status, 
        useApi: true, 
        sport, 
        league, 
        season, 
        team_id
      }
    });

    if (error) {
      console.error('Error from Edge Function:', error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error('No data returned from Edge Function');
      throw new Error('No data returned from Edge Function');
    }

    if (data?.success && data?.data) {
      console.log(`Successfully fetched ${data.data.length} matches`);
      return data.data.map((match: ApiMatch) => apiMatchToComponentMatch(match));
    }

    console.error('Invalid data format returned:', data);
    return [];
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    toast({
      title: "Erro",
      description: "Falha ao buscar partidas. Por favor, tente novamente mais tarde.",
      variant: "destructive"
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

// Fetch available leagues
export const fetchLeagues = async (
  sport: string = 'basketball',
  season: string = '2023'
): Promise<any[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('football-api', {
      body: { action: 'leagues', season, sport }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.success && data?.data) {
      return data.data;
    }

    return [];
  } catch (error: any) {
    console.error('Error fetching leagues:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao buscar ligas disponíveis. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
    return [];
  }
};

// Fetch teams for a league
export const fetchTeams = async (
  sport: string = 'basketball', 
  league: number = 12,
  season: string = '2023'
): Promise<Team[]> => {
  try {
    // Call football-api directly to get teams
    const response = await fetch('https://v1.basketball.api-sports.io/teams', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'YOUR_API_KEY',  // This will be replaced by the Edge Function
        'x-rapidapi-host': 'v1.basketball.api-sports.io'
      }
    });
    
    // We don't need response processing here since we're actually using the Edge Function
    
    // Instead call our Edge Function which has the API key properly configured
    const { data, error } = await supabase.functions.invoke('football-api', {
      body: { 
        action: 'teams', 
        league, 
        season, 
        sport 
      }
    });

    if (error) {
      console.error('Error from football-api Edge Function:', error);
      throw new Error(error.message);
    }

    if (data?.success && data?.data) {
      console.log(`Successfully fetched ${data.data.length} teams for ${sport} league ${league}`);
      return data.data;
    }

    // Return mock data for testing if API is having issues
    if (!data?.data || data.data.length === 0) {
      console.warn('No teams returned from API, using mock data');
      return [
        {
          id: "1",
          name: "Los Angeles Lakers",
          logo: "https://media.api-sports.io/basketball/teams/139.png",
          country: "USA",
          sport_type: sport
        },
        {
          id: "2",
          name: "Golden State Warriors",
          logo: "https://media.api-sports.io/basketball/teams/140.png",
          country: "USA",
          sport_type: sport
        },
        {
          id: "3",
          name: "Chicago Bulls",
          logo: "https://media.api-sports.io/basketball/teams/137.png",
          country: "USA",
          sport_type: sport
        },
        {
          id: "4",
          name: "Boston Celtics",
          logo: "https://media.api-sports.io/basketball/teams/133.png",
          country: "USA",
          sport_type: sport
        }
      ];
    }

    console.error('Invalid data format returned for teams:', data);
    return [];
  } catch (error: any) {
    console.error('Error fetching teams:', error);
    toast({
      title: 'Erro',
      description: 'Falha ao buscar times disponíveis. Por favor, tente novamente mais tarde.',
      variant: 'destructive'
    });
    
    // Return mock data for testing if API is having issues
    return [
      {
        id: "1",
        name: "Los Angeles Lakers",
        logo: "https://media.api-sports.io/basketball/teams/139.png",
        country: "USA",
        sport_type: sport
      },
      {
        id: "2",
        name: "Golden State Warriors",
        logo: "https://media.api-sports.io/basketball/teams/140.png",
        country: "USA",
        sport_type: sport
      },
      {
        id: "3",
        name: "Chicago Bulls",
        logo: "https://media.api-sports.io/basketball/teams/137.png",
        country: "USA",
        sport_type: sport
      },
      {
        id: "4",
        name: "Boston Celtics",
        logo: "https://media.api-sports.io/basketball/teams/133.png",
        country: "USA",
        sport_type: sport
      }
    ];
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
        description: 'Banco de dados inicializado com dados de partidas de esportes!'
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

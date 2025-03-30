
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Match } from "@/components/MatchCard";

// Define types for match data from API
export interface ApiMatch {
  id: string;
  homeTeam: {
    name: string;
    logo: string;
    score: number;
  };
  awayTeam: {
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

export interface MatchDetails extends ApiMatch {
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
      body: { type, limit, competition_id, status }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.success && data.data) {
      return data.data.map((match: ApiMatch) => apiMatchToComponentMatch(match));
    }

    return [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    toast({
      title: 'Error',
      description: 'Failed to fetch matches. Please try again later.',
      variant: 'destructive'
    });
    return [];
  }
};

// Fetch a single match by ID
export const fetchMatchById = async (id: string): Promise<MatchDetails | null> => {
  try {
    const { data, error } = await supabase.functions.invoke(`get-match-details/${id}`, {
      method: 'GET'
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.success && data.data) {
      return data.data as MatchDetails;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching match ${id}:`, error);
    toast({
      title: 'Error',
      description: 'Failed to fetch match details. Please try again later.',
      variant: 'destructive'
    });
    return null;
  }
};

// Initialize database with sample data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-football-data', {
      body: { league: 'all' }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.success) {
      toast({
        title: 'Success',
        description: 'Database initialized with soccer match data!'
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error initializing database:', error);
    toast({
      title: 'Error',
      description: 'Failed to initialize database. Please try again later.',
      variant: 'destructive'
    });
    return false;
  }
};


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const { type = 'all', limit = 10, competition_id, status, useApi = false, sport = 'soccer', league = 39 } = await req.json()
    console.log(`Fetching matches: type=${type}, limit=${limit}, competition=${competition_id}, status=${status}, useApi=${useApi}, sport=${sport}, league=${league}`)
    
    // If useApi is true, call the football-api function
    if (useApi) {
      // Get current date
      const today = new Date();
      
      // Calculate dates for past and future matches
      const pastDate = new Date(today);
      pastDate.setDate(pastDate.getDate() - 7); // 7 days ago
      
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + 7); // 7 days in the future
      
      // Format dates as YYYY-MM-DD
      const fromDate = pastDate.toISOString().split('T')[0];
      const toDate = futureDate.toISOString().split('T')[0];
      
      // Call football-api function
      const footballApiResponse = await supabaseClient.functions.invoke('football-api', {
        body: { 
          action: 'fixtures', 
          from: fromDate, 
          to: toDate,
          league: league, // Default league is configurable now
          sport: sport // Added sport parameter
        }
      });
      
      if (footballApiResponse.error) {
        throw new Error(footballApiResponse.error.message);
      }
      
      // Transform the data to match frontend expectations
      if (footballApiResponse.data && footballApiResponse.data.data) {
        const matches = footballApiResponse.data.data;
        
        // Filter based on type
        let filteredMatches = matches;
        if (type === 'live') {
          filteredMatches = matches.filter(match => match.is_live);
        } else if (type === 'upcoming') {
          filteredMatches = matches.filter(match => match.status === 'scheduled');
        } else if (type === 'trending') {
          // For trending, we'll sort by the most recent/upcoming matches
          filteredMatches = matches.sort((a, b) => {
            return Math.abs(a.fixture_timestamp - Math.floor(Date.now() / 1000)) - 
                   Math.abs(b.fixture_timestamp - Math.floor(Date.now() / 1000));
          });
        }
        
        // Apply limit
        filteredMatches = filteredMatches.slice(0, limit);
        
        // Transform to expected format
        const transformedMatches = filteredMatches.map(match => {
          return {
            id: match.id,
            homeTeam: {
              id: match.home_team_id,
              name: match.home_team_name,
              logo: match.home_team_logo,
              score: match.home_score || 0
            },
            awayTeam: {
              id: match.away_team_id,
              name: match.away_team_name,
              logo: match.away_team_logo,
              score: match.away_score || 0
            },
            date: match.date,
            time: match.time,
            competition: match.league_name,
            competitionLogo: match.league_logo,
            isLive: match.is_live,
            sportType: match.sport_type || sport,
            rating: 4.5, // Default rating
            reviewCount: 10, // Default review count
            tags: [match.sport_type || sport, match.league_name.toLowerCase().replace(/\s+/g, '-')],
            highlightsUrl: null,
            isFeatured: false
          };
        });
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: transformedMatches
          }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            } 
          }
        );
      }
    }
    
    // If we reach here, either useApi is false or the API call failed
    // Fall back to database query (original code)
    let query = supabaseClient
      .from('matches')
      .select(`
        id, 
        date, 
        time, 
        home_score, 
        away_score, 
        status, 
        avg_rating, 
        review_count,
        is_featured,
        highlights_url,
        sport_type,
        competitions(id, name, short_name, logo_url),
        home_team:teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
        away_team:teams!matches_away_team_id_fkey(id, name, short_name, logo_url),
        match_tags(tag)
      `)
      .order('date', { ascending: false })
    
    // Apply filters
    if (competition_id) {
      query = query.eq('competition_id', competition_id)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    if (sport) {
      query = query.eq('sport_type', sport)
    }
    
    // Apply special filters based on type
    if (type === 'featured') {
      query = query.eq('is_featured', true)
    } else if (type === 'live') {
      query = query.eq('status', 'live')
    } else if (type === 'upcoming') {
      query = query.eq('status', 'scheduled')
    } else if (type === 'trending') {
      // For trending, we'll get matches with high review counts
      query = query.order('review_count', { ascending: false })
    }
    
    const { data, error } = await query.limit(limit)
    
    if (error) {
      throw error
    }
    
    // Transform the data to match the frontend expectations
    const transformedMatches = data.map(match => {
      return {
        id: match.id,
        homeTeam: {
          id: match.home_team.id,
          name: match.home_team.name,
          logo: match.home_team.logo_url,
          score: match.home_score || 0
        },
        awayTeam: {
          id: match.away_team.id,
          name: match.away_team.name,
          logo: match.away_team.logo_url,
          score: match.away_score || 0
        },
        date: match.date,
        time: match.time,
        competition: match.competitions.name,
        competitionLogo: match.competitions.logo_url,
        isLive: match.status === 'live',
        sportType: match.sport_type || 'soccer',
        rating: match.avg_rating,
        reviewCount: match.review_count,
        tags: match.match_tags.map(tag => tag.tag),
        highlightsUrl: match.highlights_url,
        isFeatured: match.is_featured
      }
    })
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: transformedMatches
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})

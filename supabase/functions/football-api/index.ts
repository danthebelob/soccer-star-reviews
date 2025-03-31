
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Football API configuration
const FOOTBALL_API_KEY = Deno.env.get('FOOTBALL_API_KEY') || '';
const FOOTBALL_API_BASE_URL = 'https://v3.football.api-sports.io';

// Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

// Handler for all requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { action, league = 39, season = 2023, from, to, team, sport = 'soccer' } = await req.json();
    console.log(`Performing action: ${action}, sport: ${sport}, league: ${league}, season: ${season}`);
    
    if (action === 'fixtures') {
      // Fetch past and upcoming fixtures from Football API
      const url = new URL(`${FOOTBALL_API_BASE_URL}/fixtures`);
      
      // Add query parameters
      url.searchParams.append('league', league.toString());
      url.searchParams.append('season', season.toString());
      
      if (from && to) {
        url.searchParams.append('from', from);
        url.searchParams.append('to', to);
      }
      
      if (team) {
        url.searchParams.append('team', team.toString());
      }
      
      // Make request to Football API
      console.log(`Fetching data from: ${url.toString()}`);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-rapidapi-key': FOOTBALL_API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Football API error: ${data.message || 'Unknown error'}`);
      }
      
      console.log(`Received ${data.results} fixtures from Football API`);
      
      // Save data to Supabase if needed
      if (data && data.response && data.response.length > 0) {
        // Process and transform the fixtures data
        const transformedFixtures = data.response.map((fixture: any) => {
          return {
            id: fixture.fixture.id.toString(),
            date: fixture.fixture.date.split('T')[0],
            time: fixture.fixture.date.split('T')[1].substring(0, 5),
            status: mapStatus(fixture.fixture.status.short),
            home_team_id: fixture.teams.home.id.toString(),
            home_team_name: fixture.teams.home.name,
            home_team_logo: fixture.teams.home.logo,
            home_score: fixture.goals.home,
            away_team_id: fixture.teams.away.id.toString(),
            away_team_name: fixture.teams.away.name,
            away_team_logo: fixture.teams.away.logo,
            away_score: fixture.goals.away,
            league_id: fixture.league.id.toString(),
            league_name: fixture.league.name,
            league_logo: fixture.league.logo,
            venue: fixture.fixture.venue?.name,
            city: fixture.fixture.venue?.city,
            country: fixture.league.country,
            season: season.toString(),
            round: fixture.league.round,
            is_live: fixture.fixture.status.short === 'LIVE',
            fixture_timestamp: fixture.fixture.timestamp,
            sport_type: sport
          };
        });
        
        return new Response(
          JSON.stringify({
            success: true,
            data: transformedFixtures,
            count: transformedFixtures.length,
            apiResponse: data
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true, data: [], count: 0, apiResponse: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'standings') {
      // Fetch league standings
      const url = new URL(`${FOOTBALL_API_BASE_URL}/standings`);
      url.searchParams.append('league', league.toString());
      url.searchParams.append('season', season.toString());
      
      // Make request to Football API
      console.log(`Fetching standings from: ${url.toString()}`);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-rapidapi-key': FOOTBALL_API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Football API error: ${data.message || 'Unknown error'}`);
      }
      
      return new Response(
        JSON.stringify({ success: true, data: data.response }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'leagues') {
      // Fetch available leagues for a sport
      const url = new URL(`${FOOTBALL_API_BASE_URL}/leagues`);
      
      if (season) {
        url.searchParams.append('season', season.toString());
      }
      
      // Make request to Football API
      console.log(`Fetching leagues from: ${url.toString()}`);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-rapidapi-key': FOOTBALL_API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Football API error: ${data.message || 'Unknown error'}`);
      }
      
      return new Response(
        JSON.stringify({ success: true, data: data.response }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

// Helper function to map Football API status to our status format
function mapStatus(apiStatus: string): string {
  switch (apiStatus) {
    case 'NS':
      return 'scheduled';
    case 'LIVE':
    case '1H':
    case '2H':
    case 'HT':
    case 'ET':
    case 'BT':
    case 'P':
    case 'SUSP':
    case 'INT':
      return 'live';
    case 'FT':
    case 'AET':
    case 'PEN':
      return 'finished';
    case 'ABD':
    case 'AWD':
    case 'WO':
    case 'PST':
      return 'canceled';
    default:
      return 'scheduled';
  }
}

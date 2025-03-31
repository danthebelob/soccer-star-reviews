
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const footballApiKey = Deno.env.get('FOOTBALL_API_KEY') ?? '';

// Create Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const getSportEndpoint = (sport: string) => {
  switch (sport) {
    case 'basketball':
      return 'https://v1.basketball.api-sports.io';
    case 'baseball':
      return 'https://v1.baseball.api-sports.io';
    case 'hockey':
      return 'https://v1.hockey.api-sports.io';
    case 'american_football':
      return 'https://v1.american-football.api-sports.io';
    default:
      return 'https://v3.football.api-sports.io';
  }
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestData = await req.json();
    const { action, season = 2023, league = 39, from, to, sport = 'basketball', team_id = null } = requestData;
    
    console.log(`[Football API] Action: ${action}, Sport: ${sport}, League: ${league}, Season: ${season}, Team: ${team_id}`);

    // Set API endpoint based on sport
    const apiEndpoint = getSportEndpoint(sport);
    const requestHeaders = {
      'x-rapidapi-key': footballApiKey,
      'x-rapidapi-host': new URL(apiEndpoint).host,
    };

    // Default date range (if not provided)
    const currentDate = new Date();
    const defaultFrom = from || new Date(currentDate.setDate(currentDate.getDate() - 5)).toISOString().split('T')[0];
    const defaultTo = to || new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0];

    console.log(`[Football API] Date range: ${defaultFrom} to ${defaultTo}`);

    // Handle different API actions
    let endpoint = '';
    let params = '';
    let responseData;

    if (action === 'fixtures' || action === 'games') {
      if (sport === 'basketball') {
        // Basketball-specific endpoint and params
        endpoint = `/games`;
        params = `?league=${league}&season=${season}`;
        
        // Add date range if specified
        if (from && to) {
          params += `&date=${from}`;
        }
        
        // Add team filter if specified
        if (team_id) {
          params += `&team=${team_id}`;
        }
      } else {
        // Soccer endpoints
        endpoint = `/fixtures`;
        params = `?league=${league}&season=${season}&from=${defaultFrom}&to=${defaultTo}`;
        
        // Add team filter if specified
        if (team_id) {
          params += `&team=${team_id}`;
        }
      }
      
      console.log(`[Football API] Full API URL: ${apiEndpoint}${endpoint}${params}`);
      
      // Make API request for fixtures/games
      const response = await fetch(`${apiEndpoint}${endpoint}${params}`, {
        method: 'GET',
        headers: requestHeaders,
      });
      
      responseData = await response.json();
      console.log(`[Football API] Response status: ${response.status}`);
      console.log(`[Football API] Response preview: ${JSON.stringify(responseData).substring(0, 100)}...`);
      
      // Log the number of fixtures/games found
      if (responseData.response) {
        console.log(`[Football API] Found ${responseData.response.length} ${sport} games`);
      }
    } 
    else if (action === 'leagues') {
      endpoint = `/leagues`;
      params = season ? `?season=${season}` : '';
      
      console.log(`[Football API] Full API URL: ${apiEndpoint}${endpoint}${params}`);
      
      // Make API request for leagues
      const response = await fetch(`${apiEndpoint}${endpoint}${params}`, {
        method: 'GET',
        headers: requestHeaders,
      });
      
      responseData = await response.json();
    } 
    else if (action === 'teams') {
      if (sport === 'basketball') {
        endpoint = `/teams`;
        params = `?league=${league}&season=${season}`;
        
        if (team_id) {
          params += `&id=${team_id}`;
        }
        
        console.log(`[Football API] Full API URL: ${apiEndpoint}${endpoint}${params}`);
        
        // Make API request for teams
        const response = await fetch(`${apiEndpoint}${endpoint}${params}`, {
          method: 'GET',
          headers: requestHeaders,
        });
        
        responseData = await response.json();
      } else {
        endpoint = `/teams`;
        params = `?league=${league}&season=${season}`;
        
        if (team_id) {
          params += `&id=${team_id}`;
        }
        
        console.log(`[Football API] Full API URL: ${apiEndpoint}${endpoint}${params}`);
        
        // Make API request for teams
        const response = await fetch(`${apiEndpoint}${endpoint}${params}`, {
          method: 'GET',
          headers: requestHeaders,
        });
        
        responseData = await response.json();
      }
    }
    else {
      throw new Error(`Unknown action: ${action}`);
    }

    // Format data for our application
    let formattedData: any[] = [];
    let count = 0;

    if (responseData) {
      if (action === 'fixtures' || action === 'games') {
        if (sport === 'basketball') {
          // Process basketball fixtures/games
          if (responseData.response) {
            console.log(`[Football API] Processing ${responseData.response.length} basketball games`);
            formattedData = responseData.response.map((game: any) => ({
              id: `${sport}-${game.id}`,
              date: game.date ? game.date.split('T')[0] : '2023-01-01',
              time: game.time || '00:00',
              fixture_timestamp: game.timestamp || Math.floor(Date.now() / 1000),
              home_team_id: game.teams?.home?.id || null,
              home_team_name: game.teams?.home?.name || 'Home Team',
              home_team_logo: game.teams?.home?.logo || null,
              home_score: game.scores?.home?.total || 0,
              away_team_id: game.teams?.away?.id || null,
              away_team_name: game.teams?.away?.name || 'Away Team',
              away_team_logo: game.teams?.away?.logo || null,
              away_score: game.scores?.away?.total || 0,
              is_live: game.status?.short === 'LIVE',
              status: game.status?.long || 'Not Started',
              league_id: game.league?.id || league,
              league_name: game.league?.name || 'Basketball League',
              league_logo: game.league?.logo || null,
              league_country: game.country?.name || 'International',
              league_flag: game.country?.flag || null,
              sport_type: sport
            }));
          }
        } else {
          // Process football/soccer fixtures
          if (responseData.response) {
            formattedData = responseData.response.map((fixture: any) => ({
              id: `${sport}-${fixture.fixture?.id}`,
              date: fixture.fixture?.date ? fixture.fixture.date.split('T')[0] : '2023-01-01',
              time: fixture.fixture?.date ? fixture.fixture.date.split('T')[1].substring(0, 5) : '00:00',
              fixture_timestamp: fixture.fixture?.timestamp || Math.floor(Date.now() / 1000),
              home_team_id: fixture.teams?.home?.id || null,
              home_team_name: fixture.teams?.home?.name || 'Home Team',
              home_team_logo: fixture.teams?.home?.logo || null,
              home_score: fixture.goals?.home || 0,
              away_team_id: fixture.teams?.away?.id || null,
              away_team_name: fixture.teams?.away?.name || 'Away Team',
              away_team_logo: fixture.teams?.away?.logo || null,
              away_score: fixture.goals?.away || 0,
              is_live: fixture.fixture?.status?.short === 'LIVE',
              status: fixture.fixture?.status?.long || 'Not Started',
              league_id: fixture.league?.id || league,
              league_name: fixture.league?.name || 'League',
              league_logo: fixture.league?.logo || null,
              league_country: fixture.league?.country || 'International',
              league_flag: fixture.league?.flag || null,
              sport_type: sport
            }));
          }
        }
      } else if (action === 'leagues') {
        // Process leagues data
        if (responseData.response) {
          formattedData = responseData.response.map((league: any) => {
            if (sport === 'basketball') {
              return {
                id: league.id,
                name: league.name,
                logo: league.logo,
                country: league.country?.name || 'International',
                flag: league.country?.flag || null,
                season: league.seasons?.length > 0 ? league.seasons[0].season : season,
                sport_type: sport
              };
            } else {
              return {
                id: league.league?.id,
                name: league.league?.name,
                logo: league.league?.logo,
                country: league.country?.name || 'International',
                flag: league.country?.flag || null,
                season: league.seasons?.length > 0 ? league.seasons[0].year : season,
                sport_type: sport
              };
            }
          });
        }
      } else if (action === 'teams') {
        // Process teams data
        if (responseData.response) {
          if (sport === 'basketball') {
            formattedData = responseData.response.map((team: any) => ({
              id: team.id,
              name: team.name,
              logo: team.logo,
              country: team.country?.name || 'Unknown',
              sport_type: sport
            }));
          } else {
            formattedData = responseData.response.map((team: any) => ({
              id: team.team?.id,
              name: team.team?.name,
              logo: team.team?.logo,
              country: team.team?.country || 'Unknown',
              sport_type: sport
            }));
          }
        }
      }

      count = formattedData.length;
      console.log(`[Football API] Successfully formatted ${count} records`);
    } else {
      console.error(`[Football API] API returned error or no data:`, responseData);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: formattedData,
        count,
        raw: responseData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error(`[Football API] Error processing request:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred',
        stack: error.stack || ''
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

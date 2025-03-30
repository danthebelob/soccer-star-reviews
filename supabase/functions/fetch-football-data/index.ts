
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

// Sample data for teams
const sampleTeams = [
  { name: 'Manchester United', short_name: 'Man Utd', logo_url: 'https://media.api-sports.io/football/teams/33.png', country: 'England' },
  { name: 'Liverpool', short_name: 'Liverpool', logo_url: 'https://media.api-sports.io/football/teams/40.png', country: 'England' },
  { name: 'Real Madrid', short_name: 'Real Madrid', logo_url: 'https://media.api-sports.io/football/teams/541.png', country: 'Spain' },
  { name: 'Barcelona', short_name: 'Barcelona', logo_url: 'https://media.api-sports.io/football/teams/529.png', country: 'Spain' },
  { name: 'Bayern Munich', short_name: 'Bayern', logo_url: 'https://media.api-sports.io/football/teams/157.png', country: 'Germany' },
  { name: 'Juventus', short_name: 'Juventus', logo_url: 'https://media.api-sports.io/football/teams/496.png', country: 'Italy' },
  { name: 'Paris Saint-Germain', short_name: 'PSG', logo_url: 'https://media.api-sports.io/football/teams/85.png', country: 'France' },
  { name: 'Manchester City', short_name: 'Man City', logo_url: 'https://media.api-sports.io/football/teams/50.png', country: 'England' },
  { name: 'Chelsea', short_name: 'Chelsea', logo_url: 'https://media.api-sports.io/football/teams/49.png', country: 'England' },
  { name: 'Arsenal', short_name: 'Arsenal', logo_url: 'https://media.api-sports.io/football/teams/42.png', country: 'England' },
  { name: 'Atletico Madrid', short_name: 'Atletico', logo_url: 'https://media.api-sports.io/football/teams/530.png', country: 'Spain' },
  { name: 'Borussia Dortmund', short_name: 'Dortmund', logo_url: 'https://media.api-sports.io/football/teams/165.png', country: 'Germany' },
  { name: 'Inter Milan', short_name: 'Inter', logo_url: 'https://media.api-sports.io/football/teams/505.png', country: 'Italy' },
  { name: 'AC Milan', short_name: 'Milan', logo_url: 'https://media.api-sports.io/football/teams/489.png', country: 'Italy' },
  { name: 'Ajax', short_name: 'Ajax', logo_url: 'https://media.api-sports.io/football/teams/194.png', country: 'Netherlands' },
  { name: 'Porto', short_name: 'Porto', logo_url: 'https://media.api-sports.io/football/teams/212.png', country: 'Portugal' }
];

// Sample tags for matches
const sampleTags = [
  'derby', 'rivalry', 'title-decider', 'relegation-battle', 'comeback', 'upset',
  'clean-sheet', 'high-scoring', 'goalfest', 'hat-trick', 'penalty', 'red-card',
  'extra-time', 'shootout', 'injury-time-goal', 'debut', 'milestone'
];

// Generate a random date in the recent past or near future
const generateRandomDate = () => {
  const now = new Date();
  // Random days between -30 to +30 (past 1 month to future 1 month)
  const daysOffset = Math.floor(Math.random() * 60) - 30;
  const date = new Date(now);
  date.setDate(date.getDate() + daysOffset);
  return date;
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Generate a random time
const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 12) + 12; // Afternoon/evening times
  const minutes = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
  return `${hours}:${minutes}`;
};

// Generate a random status based on date
const generateStatus = (date: Date) => {
  const now = new Date();
  if (date < now) {
    return 'finished';
  } else if (Math.random() < 0.1) { // 10% chance of being live
    return 'live';
  } else {
    return 'scheduled';
  }
};

// Generate random score based on status
const generateScore = (status: string) => {
  if (status === 'scheduled') {
    return null;
  } else {
    return Math.floor(Math.random() * 5); // 0-4 goals
  }
};

// Handler for all requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { action = 'initialize', league = 'all' } = await req.json();
    console.log(`Performing action: ${action}, league: ${league}`);
    
    if (action === 'initialize') {
      // Step 1: Insert teams if they don't exist
      for (const team of sampleTeams) {
        const { error: teamError } = await supabaseClient
          .from('teams')
          .upsert(
            { 
              name: team.name, 
              short_name: team.short_name,
              logo_url: team.logo_url,
              country: team.country
            },
            { onConflict: 'name' }
          );
        
        if (teamError) {
          console.error(`Error inserting team ${team.name}:`, teamError);
        }
      }
      
      // Step 2: Fetch all teams and competitions
      const { data: teams, error: teamsError } = await supabaseClient
        .from('teams')
        .select('id, name, country');
      
      if (teamsError) {
        throw teamsError;
      }
      
      const { data: competitions, error: compError } = await supabaseClient
        .from('competitions')
        .select('id, name, type');
      
      if (compError) {
        throw compError;
      }
      
      // Step 3: Create sample matches
      const matches = [];
      
      // Create 50 sample matches
      for (let i = 0; i < 50; i++) {
        // Pick random teams, ensuring they're from the same country for league matches
        const homeTeamIndex = Math.floor(Math.random() * teams.length);
        let awayTeamIndex;
        do {
          awayTeamIndex = Math.floor(Math.random() * teams.length);
        } while (awayTeamIndex === homeTeamIndex);
        
        const homeTeam = teams[homeTeamIndex];
        const awayTeam = teams[awayTeamIndex];
        
        // Pick a competition (prefer same country for league matches)
        let eligibleCompetitions = competitions.filter(c => 
          c.type === 'international' || 
          (c.type === 'league' && c.name.includes(homeTeam.country))
        );
        
        if (eligibleCompetitions.length === 0) {
          eligibleCompetitions = competitions;
        }
        
        const competition = eligibleCompetitions[Math.floor(Math.random() * eligibleCompetitions.length)];
        
        // Generate date and time
        const matchDate = generateRandomDate();
        const formattedDate = formatDate(matchDate);
        const matchTime = generateRandomTime();
        
        // Determine status and scores
        const status = generateStatus(matchDate);
        const homeScore = generateScore(status);
        const awayScore = generateScore(status);
        
        // Calculate average rating (for finished matches)
        const avgRating = status === 'finished' ? (2 + Math.random() * 3).toFixed(2) : null;
        const reviewCount = status === 'finished' ? Math.floor(Math.random() * 100) : 0;
        
        // Featured match (10% chance)
        const isFeatured = Math.random() < 0.1;
        
        // Create the match
        matches.push({
          competition_id: competition.id,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          date: formattedDate,
          time: matchTime,
          status: status,
          home_score: homeScore,
          away_score: awayScore,
          stadium: `${homeTeam.name} Stadium`,
          city: homeTeam.country,
          country: homeTeam.country,
          season: '2025',
          is_featured: isFeatured,
          avg_rating: avgRating,
          review_count: reviewCount
        });
      }
      
      // Insert matches
      const { error: matchesError } = await supabaseClient
        .from('matches')
        .upsert(matches);
      
      if (matchesError) {
        throw matchesError;
      }
      
      // Step 4: Add tags to matches
      const { data: insertedMatches, error: fetchError } = await supabaseClient
        .from('matches')
        .select('id, status');
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Add 1-3 random tags to each match
      for (const match of insertedMatches) {
        // Skip scheduled matches sometimes
        if (match.status === 'scheduled' && Math.random() < 0.3) {
          continue;
        }
        
        const tagCount = Math.floor(Math.random() * 3) + 1;
        const matchTags = [];
        
        // Get random unique tags
        const shuffledTags = [...sampleTags].sort(() => 0.5 - Math.random());
        const selectedTags = shuffledTags.slice(0, tagCount);
        
        for (const tag of selectedTags) {
          matchTags.push({
            match_id: match.id,
            tag: tag
          });
        }
        
        // Insert tags
        const { error: tagsError } = await supabaseClient
          .from('match_tags')
          .upsert(matchTags, { onConflict: ['match_id', 'tag'] });
        
        if (tagsError) {
          console.error(`Error inserting tags for match ${match.id}:`, tagsError);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Database initialized with sample data",
          stats: {
            teams: teams.length,
            competitions: competitions.length,
            matches: matches.length
          }
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    );
  }
});

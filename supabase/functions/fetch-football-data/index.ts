
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Supabase client 
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const { league = 'all' } = await req.json()
    console.log(`Fetching data for league: ${league}`)
    
    // Since we don't have a paid API key, let's simulate the response with mock data
    // In a real scenario, you would use API-FOOTBALL or a similar service
    const dummyTeams = [
      { id: 1, name: 'Manchester United', short_name: 'Man Utd', logo_url: 'https://media.api-sports.io/football/teams/33.png', country: 'England' },
      { id: 2, name: 'Liverpool', short_name: 'Liverpool', logo_url: 'https://media.api-sports.io/football/teams/40.png', country: 'England' },
      { id: 3, name: 'Real Madrid', short_name: 'Real Madrid', logo_url: 'https://media.api-sports.io/football/teams/541.png', country: 'Spain' },
      { id: 4, name: 'Barcelona', short_name: 'Barcelona', logo_url: 'https://media.api-sports.io/football/teams/529.png', country: 'Spain' },
      { id: 5, name: 'Bayern Munich', short_name: 'Bayern', logo_url: 'https://media.api-sports.io/football/teams/157.png', country: 'Germany' },
      { id: 6, name: 'Paris Saint-Germain', short_name: 'PSG', logo_url: 'https://media.api-sports.io/football/teams/85.png', country: 'France' },
      { id: 7, name: 'Manchester City', short_name: 'Man City', logo_url: 'https://media.api-sports.io/football/teams/50.png', country: 'England' },
      { id: 8, name: 'Juventus', short_name: 'Juventus', logo_url: 'https://media.api-sports.io/football/teams/496.png', country: 'Italy' },
      { id: 9, name: 'Inter Milan', short_name: 'Inter', logo_url: 'https://media.api-sports.io/football/teams/505.png', country: 'Italy' },
      { id: 10, name: 'AC Milan', short_name: 'Milan', logo_url: 'https://media.api-sports.io/football/teams/489.png', country: 'Italy' },
      { id: 11, name: 'Arsenal', short_name: 'Arsenal', logo_url: 'https://media.api-sports.io/football/teams/42.png', country: 'England' },
      { id: 12, name: 'Chelsea', short_name: 'Chelsea', logo_url: 'https://media.api-sports.io/football/teams/49.png', country: 'England' },
      { id: 13, name: 'Borussia Dortmund', short_name: 'Dortmund', logo_url: 'https://media.api-sports.io/football/teams/165.png', country: 'Germany' },
      { id: 14, name: 'Atletico Madrid', short_name: 'Atletico', logo_url: 'https://media.api-sports.io/football/teams/530.png', country: 'Spain' },
      { id: 15, name: 'Napoli', short_name: 'Napoli', logo_url: 'https://media.api-sports.io/football/teams/492.png', country: 'Italy' },
      { id: 16, name: 'Argentina', short_name: 'Argentina', logo_url: 'https://media.api-sports.io/football/teams/26.png', country: 'Argentina' },
      { id: 17, name: 'France', short_name: 'France', logo_url: 'https://media.api-sports.io/football/teams/2.png', country: 'France' },
      { id: 18, name: 'Brazil', short_name: 'Brazil', logo_url: 'https://media.api-sports.io/football/teams/6.png', country: 'Brazil' },
      { id: 19, name: 'Germany', short_name: 'Germany', logo_url: 'https://media.api-sports.io/football/teams/25.png', country: 'Germany' },
      { id: 20, name: 'Portugal', short_name: 'Portugal', logo_url: 'https://media.api-sports.io/football/teams/27.png', country: 'Portugal' }
    ]
    
    // Mock competitions data - we use the IDs we already inserted into the database
    const { data: competitionsData } = await supabaseClient
      .from('competitions')
      .select('id, name, short_name')
    
    if (!competitionsData || competitionsData.length === 0) {
      throw new Error('No competitions found in the database')
    }
    
    // Insert teams
    for (const team of dummyTeams) {
      const { error } = await supabaseClient
        .from('teams')
        .upsert({
          name: team.name,
          short_name: team.short_name,
          logo_url: team.logo_url,
          country: team.country
        }, { onConflict: 'name' })
      
      if (error) {
        console.error(`Error inserting team ${team.name}:`, error)
      }
    }
    
    // Fetch the teams we just inserted
    const { data: teams } = await supabaseClient
      .from('teams')
      .select('id, name')
    
    if (!teams || teams.length === 0) {
      throw new Error('No teams found in the database')
    }
    
    // Generate matches
    const matches = []
    
    // Function to get random items from an array
    const getRandomItems = (arr, count) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }
    
    // For each competition, create some matches
    for (const competition of competitionsData) {
      // Get random teams for this competition
      const competitionTeams = getRandomItems(teams, 10)
      
      // Create a few past matches
      for (let i = 0; i < 5; i++) {
        const homeTeamIndex = Math.floor(Math.random() * competitionTeams.length)
        let awayTeamIndex
        do {
          awayTeamIndex = Math.floor(Math.random() * competitionTeams.length)
        } while (awayTeamIndex === homeTeamIndex)
        
        const homeTeam = competitionTeams[homeTeamIndex]
        const awayTeam = competitionTeams[awayTeamIndex]
        const homeScore = Math.floor(Math.random() * 5)
        const awayScore = Math.floor(Math.random() * 5)
        
        // Random date in the past 30 days
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))
        
        matches.push({
          competition_id: competition.id,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          home_score: homeScore,
          away_score: awayScore,
          date: date.toISOString().split('T')[0],
          time: '20:00',
          status: 'finished',
          season: '2023/2024',
          round: `Matchday ${Math.floor(Math.random() * 38) + 1}`,
          avg_rating: (3 + Math.random() * 2).toFixed(2),
          review_count: Math.floor(Math.random() * 1000)
        })
      }
      
      // Create a few upcoming matches
      for (let i = 0; i < 3; i++) {
        const homeTeamIndex = Math.floor(Math.random() * competitionTeams.length)
        let awayTeamIndex
        do {
          awayTeamIndex = Math.floor(Math.random() * competitionTeams.length)
        } while (awayTeamIndex === homeTeamIndex)
        
        const homeTeam = competitionTeams[homeTeamIndex]
        const awayTeam = competitionTeams[awayTeamIndex]
        
        // Random date in the next 14 days
        const date = new Date()
        date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1)
        
        matches.push({
          competition_id: competition.id,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          date: date.toISOString().split('T')[0],
          time: '20:00',
          status: 'scheduled',
          season: '2023/2024',
          round: `Matchday ${Math.floor(Math.random() * 38) + 1}`
        })
      }
      
      // Create 1-2 live matches
      if (Math.random() > 0.5) {
        const homeTeamIndex = Math.floor(Math.random() * competitionTeams.length)
        let awayTeamIndex
        do {
          awayTeamIndex = Math.floor(Math.random() * competitionTeams.length)
        } while (awayTeamIndex === homeTeamIndex)
        
        const homeTeam = competitionTeams[homeTeamIndex]
        const awayTeam = competitionTeams[awayTeamIndex]
        const homeScore = Math.floor(Math.random() * 3)
        const awayScore = Math.floor(Math.random() * 3)
        
        const today = new Date()
        
        matches.push({
          competition_id: competition.id,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          home_score: homeScore,
          away_score: awayScore,
          date: today.toISOString().split('T')[0],
          time: '20:00',
          status: 'live',
          season: '2023/2024',
          round: `Matchday ${Math.floor(Math.random() * 38) + 1}`
        })
      }
    }
    
    // Insert matches
    for (const match of matches) {
      const { error } = await supabaseClient
        .from('matches')
        .upsert(match, { onConflict: 'id' })
      
      if (error) {
        console.error(`Error inserting match:`, error)
      }
    }
    
    // Mark a few matches as featured
    const { data: allMatches } = await supabaseClient
      .from('matches')
      .select('id')
      .limit(100)
    
    if (allMatches && allMatches.length > 0) {
      const featuredMatches = getRandomItems(allMatches, 3)
      
      for (const match of featuredMatches) {
        const { error } = await supabaseClient
          .from('matches')
          .update({ is_featured: true })
          .eq('id', match.id)
        
        if (error) {
          console.error(`Error marking match as featured:`, error)
        }
      }
    }
    
    // Add some tags to matches
    const tags = [
      'Derby', 'Rivalry', 'Classic', 'Title Decider', 'Thriller', 
      'Comeback', 'Clean Sheet', 'Hat-trick', 'Penalty Shootout',
      'Final', 'Semi-final', 'Group Stage', 'Knockout', 'Extra Time'
    ]
    
    const { data: matchesForTags } = await supabaseClient
      .from('matches')
      .select('id')
      .limit(20)
    
    if (matchesForTags && matchesForTags.length > 0) {
      for (const match of matchesForTags) {
        // Add 1-3 random tags per match
        const matchTags = getRandomItems(tags, Math.floor(Math.random() * 3) + 1)
        
        for (const tag of matchTags) {
          const { error } = await supabaseClient
            .from('match_tags')
            .upsert({
              match_id: match.id,
              tag
            }, { onConflict: 'match_id, tag' })
          
          if (error) {
            console.error(`Error adding tag to match:`, error)
          }
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Data imported successfully: ${matches.length} matches created` 
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

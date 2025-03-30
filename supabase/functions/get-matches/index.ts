
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
    const { type = 'all', limit = 10, competition_id, status } = await req.json()
    console.log(`Fetching matches: type=${type}, limit=${limit}, competition=${competition_id}, status=${status}`)
    
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
        competitions(id, name, short_name, logo_url),
        teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
        teams!matches_away_team_id_fkey(id, name, short_name, logo_url),
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
      const homeTeam = match.teams;
      const awayTeam = match['teams!matches_away_team_id_fkey'];
      
      return {
        id: match.id,
        homeTeam: {
          id: homeTeam.id,
          name: homeTeam.name,
          logo: homeTeam.logo_url,
          score: match.home_score || 0
        },
        awayTeam: {
          id: awayTeam.id,
          name: awayTeam.name,
          logo: awayTeam.logo_url,
          score: match.away_score || 0
        },
        date: match.date,
        time: match.time,
        competition: match.competitions.name,
        competitionLogo: match.competitions.logo_url,
        isLive: match.status === 'live',
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

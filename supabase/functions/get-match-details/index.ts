
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
    const url = new URL(req.url)
    const matchId = url.pathname.split('/').pop()
    
    if (!matchId) {
      throw new Error('Match ID is required')
    }
    
    console.log(`Fetching match details for: ${matchId}`)
    
    // Query match details
    const { data: match, error: matchError } = await supabaseClient
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
        stadium,
        city,
        country,
        season,
        stage,
        round,
        is_featured,
        highlights_url,
        competitions(id, name, short_name, logo_url),
        teams!matches_home_team_id_fkey(id, name, short_name, logo_url),
        teams!matches_away_team_id_fkey(id, name, short_name, logo_url)
      `)
      .eq('id', matchId)
      .single()
    
    if (matchError) {
      throw matchError
    }
    
    // Query match tags
    const { data: tags, error: tagsError } = await supabaseClient
      .from('match_tags')
      .select('tag')
      .eq('match_id', matchId)
    
    if (tagsError) {
      throw tagsError
    }
    
    // Query reviews for this match
    const { data: reviews, error: reviewsError } = await supabaseClient
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles(id, username, avatar_url)
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (reviewsError) {
      throw reviewsError
    }
    
    // Format match data
    const matchDetails = {
      id: match.id,
      homeTeam: {
        id: match.teams.id,
        name: match.teams.name,
        logo: match.teams.logo_url,
        score: match.home_score || 0
      },
      awayTeam: {
        id: match.teams.id,
        name: match.teams.name,
        logo: match.teams.logo_url,
        score: match.away_score || 0
      },
      date: match.date,
      time: match.time,
      competition: {
        id: match.competitions.id,
        name: match.competitions.name,
        shortName: match.competitions.short_name,
        logo: match.competitions.logo_url
      },
      venue: {
        stadium: match.stadium,
        city: match.city,
        country: match.country
      },
      status: match.status,
      isLive: match.status === 'live',
      season: match.season,
      stage: match.stage,
      round: match.round,
      rating: match.avg_rating,
      reviewCount: match.review_count,
      tags: tags.map(t => t.tag),
      highlightsUrl: match.highlights_url,
      isFeatured: match.is_featured,
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        user: {
          id: review.profiles?.id,
          username: review.profiles?.username,
          avatar: review.profiles?.avatar_url
        }
      }))
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: matchDetails
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


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { Calendar, Clock, MapPin, Trophy, MessageSquare, Share, Eye, Bookmark, Play } from "lucide-react";
import { fetchMatchById, MatchDetails as MatchDetailsType } from "@/integrations/api/matches";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatch = async () => {
      if (id) {
        setLoading(true);
        const matchData = await fetchMatchById(id);
        setMatch(matchData);
        setLoading(false);
      }
    };

    loadMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-soccer-grass"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Match Not Found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find the match you're looking for.</p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(match.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Match Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link to={`/competitions/${match.competition.id}`} className="flex items-center gap-2 hover:underline">
                  <img 
                    src={match.competition.logo} 
                    alt={match.competition.name} 
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/24?text=Cup';
                    }}
                  />
                  <span className="font-medium">{match.competition.name}</span>
                </Link>
                {match.isLive && (
                  <Badge variant="destructive" className="ml-2">LIVE</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">{match.homeTeam.name} vs {match.awayTeam.name}</h1>
              <div className="text-muted-foreground mt-1">
                {match.round && `${match.round} • `}
                {match.stage && `${match.stage} • `}
                {match.season}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" /> Mark as Watched
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-1" /> Add to Wishlist
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Match Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Score Card */}
            <Card className="mb-6 overflow-hidden border-2">
              <div className={`p-4 ${match.status === 'finished' ? 'bg-soccer-grass text-white' : match.isLive ? 'bg-red-600 text-white' : 'bg-amber-50'}`}>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">
                    {match.status === 'finished' ? 'Final Score' : match.isLive ? 'LIVE' : 'Upcoming Match'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{match.time}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-7 items-center">
                  {/* Home Team */}
                  <div className="col-span-3 flex flex-col items-center text-center gap-3">
                    <img 
                      src={match.homeTeam.logo} 
                      alt={match.homeTeam.name}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/64?text=Team';
                      }}
                    />
                    <span className="font-bold text-lg">{match.homeTeam.name}</span>
                  </div>
                  
                  {/* Score */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <div className="font-bold text-4xl mb-2">
                      {match.homeTeam.score} - {match.awayTeam.score}
                    </div>
                    {match.status !== 'scheduled' && (
                      <div className="flex items-center gap-2 mt-2">
                        <StarRating readOnly initialRating={match.rating || 0} size={18} />
                        <span className="text-sm text-muted-foreground">({match.reviewCount || 0})</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Away Team */}
                  <div className="col-span-3 flex flex-col items-center text-center gap-3">
                    <img 
                      src={match.awayTeam.logo} 
                      alt={match.awayTeam.name}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/64?text=Team';
                      }}
                    />
                    <span className="font-bold text-lg">{match.awayTeam.name}</span>
                  </div>
                </div>
                
                {match.venue && (match.venue.stadium || match.venue.city) && (
                  <div className="flex justify-center mt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {match.venue.stadium && match.venue.stadium}
                        {match.venue.city && match.venue.stadium && ', '}
                        {match.venue.city && match.venue.city}
                        {match.venue.country && match.venue.city && ', '}
                        {match.venue.country && match.venue.country}
                      </span>
                    </div>
                  </div>
                )}
                
                {match.tags && match.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {match.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Highlights Video */}
            {match.highlightsUrl && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Play className="w-5 h-5 mr-2 text-soccer-score" /> Match Highlights
                    </h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <AspectRatio ratio={16 / 9}>
                    <iframe 
                      className="w-full h-full rounded-md"
                      src={match.highlightsUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                      title="Match Highlights"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </AspectRatio>
                </CardContent>
              </Card>
            )}
            
            {/* Reviews & Comments */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-primary" /> Reviews & Comments
                  </h2>
                  <Button>Write a Review</Button>
                </div>
              </CardHeader>
              <CardContent>
                {match.reviews && match.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {match.reviews.map((review) => (
                      <div key={review.id} className="pb-6 last:pb-0 border-b last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img 
                              src={review.user?.avatar || "https://via.placeholder.com/48?text=User"} 
                              alt={review.user?.username || "Anonymous"} 
                              className="w-12 h-12 rounded-full object-cover" 
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{review.user?.username || "Anonymous User"}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <StarRating readOnly initialRating={review.rating} size={16} />
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {review.comment && (
                              <p className="mt-2 text-foreground">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center mt-6">
                      <Button variant="outline">Load More Reviews</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-30 mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                    <p className="text-muted-foreground mb-4">Be the first to review this match!</p>
                    <Button>Write a Review</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Competition Info */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-soccer-score" /> Competition
                </h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={match.competition.logo} 
                    alt={match.competition.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/48?text=Cup';
                    }}
                  />
                  <div>
                    <div className="font-medium">{match.competition.name}</div>
                    <div className="text-sm text-muted-foreground">{match.season}</div>
                  </div>
                </div>
                
                {match.round && (
                  <div className="mb-2">
                    <div className="text-sm font-medium mb-1">Round</div>
                    <div>{match.round}</div>
                  </div>
                )}
                
                {match.stage && (
                  <div>
                    <div className="text-sm font-medium mb-1">Stage</div>
                    <div>{match.stage}</div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/competitions/${match.competition.id}`}>
                      View Competition
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Team Links */}
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Teams</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to={`/teams/${match.homeTeam.id}`} className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors">
                  <img 
                    src={match.homeTeam.logo} 
                    alt={match.homeTeam.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/32?text=Team';
                    }}
                  />
                  <span className="font-medium">{match.homeTeam.name}</span>
                </Link>
                
                <Link to={`/teams/${match.awayTeam.id}`} className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors">
                  <img 
                    src={match.awayTeam.logo} 
                    alt={match.awayTeam.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/32?text=Team';
                    }}
                  />
                  <span className="font-medium">{match.awayTeam.name}</span>
                </Link>
              </CardContent>
            </Card>
            
            {/* Similar Matches */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">You Might Also Like</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">We'll add similar matches here when we have more data.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchDetails;

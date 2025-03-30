
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleMatches, upcomingMatches, liveMatches, currentUser } from "@/data/mockData";
import FeaturedMatch from "@/components/FeaturedMatch";
import MatchCard from "@/components/MatchCard";
import UserProfileCard from "@/components/UserProfileCard";
import { Calendar, Trophy, TrendingUp, Flame, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMatches, initializeDatabase } from "@/integrations/api/matches";
import { toast } from "@/components/ui/use-toast";
import { Match } from "@/components/MatchCard";

const Home = () => {
  const [featuredMatch, setFeaturedMatch] = useState<Match | null>(null);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [trendingMatches, setTrendingMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [communityMatches, setCommunityMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      setIsLoading(true);
      
      try {
        // First check if we should initialize the database
        const [featured, live, trending, upcoming] = await Promise.all([
          fetchMatches('featured', 1),
          fetchMatches('live', 4),
          fetchMatches('trending', 4),
          fetchMatches('upcoming', 4)
        ]);
        
        // If no matches were found, initialize the database
        if (
          featured.length === 0 && 
          live.length === 0 && 
          trending.length === 0 && 
          upcoming.length === 0
        ) {
          toast({
            title: "Initializing database",
            description: "Setting up sample match data...",
          });
          
          const initialized = await initializeDatabase();
          
          if (initialized) {
            // Retry fetching after initialization
            const [newFeatured, newLive, newTrending, newUpcoming] = await Promise.all([
              fetchMatches('featured', 1),
              fetchMatches('live', 4),
              fetchMatches('trending', 4),
              fetchMatches('upcoming', 4)
            ]);
            
            setFeaturedMatch(newFeatured[0] || null);
            setLiveMatches(newLive);
            setTrendingMatches(newTrending);
            setUpcomingMatches(newUpcoming);
            setCommunityMatches(newTrending.slice(0, 4)); // Use trending as community for now
          } else {
            // Fall back to mock data if initialization failed
            setFeaturedMatch(sampleMatches[0]);
            setLiveMatches(liveMatches);
            setTrendingMatches(sampleMatches.slice(1, 5));
            setUpcomingMatches(upcomingMatches);
            setCommunityMatches(sampleMatches.slice(3, 7));
          }
        } else {
          // Use fetched data
          setFeaturedMatch(featured[0] || null);
          setLiveMatches(live);
          setTrendingMatches(trending);
          setUpcomingMatches(upcoming);
          setCommunityMatches(trending.slice(0, 4)); // Use trending as community for now
        }
      } catch (error) {
        console.error("Failed to load matches:", error);
        // Fall back to mock data
        setFeaturedMatch(sampleMatches[0]);
        setLiveMatches(liveMatches);
        setTrendingMatches(sampleMatches.slice(1, 5));
        setUpcomingMatches(upcomingMatches);
        setCommunityMatches(sampleMatches.slice(3, 7));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMatches();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Hero section with featured match */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Trophy className="mr-2 text-soccer-score" /> Featured Match
              </h1>
              {isLoading ? (
                <div className="h-96 flex items-center justify-center border rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-soccer-grass"></div>
                </div>
              ) : featuredMatch ? (
                <FeaturedMatch 
                  match={featuredMatch} 
                  highlightUrl="https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
                />
              ) : (
                <div className="h-96 flex flex-col items-center justify-center border rounded-lg">
                  <Trophy className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">No featured matches right now.</p>
                </div>
              )}
            </div>
            
            <div className="md:w-1/4">
              <UserProfileCard user={currentUser} className="h-full" />
            </div>
          </div>
        </section>
        
        {/* Live matches section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Flame className="mr-2 text-red-500" /> Live Now
            </h2>
            <Button variant="outline" asChild>
              <Link to="/live">View All</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-soccer-grass"></div>
            </div>
          ) : liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {liveMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border rounded-lg">
              <Flame className="w-12 h-12 text-muted-foreground opacity-20 mb-3" />
              <p className="text-muted-foreground">No live matches right now. Check back later!</p>
            </div>
          )}
        </section>
        
        {/* Matches tabs section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Calendar className="mr-2 text-primary" /> Matches
            </h2>
          </div>
          
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="trending" className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" /> Trending
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                <Calendar className="w-4 h-4 mr-2" /> Upcoming
              </TabsTrigger>
              <TabsTrigger value="community">
                <Users className="w-4 h-4 mr-2" /> Community Favorites
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="space-y-4">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-soccer-grass"></div>
                </div>
              ) : trendingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trendingMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border rounded-lg">
                  <TrendingUp className="w-12 h-12 text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">No trending matches available.</p>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link to="/matches">View All Matches</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-soccer-grass"></div>
                </div>
              ) : upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {upcomingMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border rounded-lg">
                  <Calendar className="w-12 h-12 text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">No upcoming matches scheduled.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="community" className="space-y-4">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-soccer-grass"></div>
                </div>
              ) : communityMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {communityMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border rounded-lg">
                  <Users className="w-12 h-12 text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">No community favorites yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <footer className="mt-auto py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Trophy className="w-6 h-6 text-soccer-grass mr-2" />
              <span className="text-xl font-bold">Soccer<span className="text-soccer-score">Star</span> Reviews</span>
            </div>
            
            <div className="flex space-x-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SoccerStar Reviews. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

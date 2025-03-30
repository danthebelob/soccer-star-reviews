
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleMatches, upcomingMatches, liveMatches, currentUser } from "@/data/mockData";
import FeaturedMatch from "@/components/FeaturedMatch";
import MatchCard from "@/components/MatchCard";
import UserProfileCard from "@/components/UserProfileCard";
import { Calendar, Trophy, TrendingUp, Flame, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  // Featured match is the first match from sampleMatches
  const featuredMatch = sampleMatches[0];

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
              <FeaturedMatch 
                match={featuredMatch} 
                highlightUrl="https://images.unsplash.com/photo-1517747614396-d21a78b850e8?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
              />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sampleMatches.slice(1, 5).map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link to="/matches">View All Matches</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="community" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sampleMatches.slice(3, 7).map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
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


import Navbar from "@/components/Navbar";
import UserProfileCard from "@/components/UserProfileCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, EyeIcon, ListChecks } from "lucide-react";
import { currentUser, sampleMatches } from "@/data/mockData";
import MatchCard from "@/components/MatchCard";
import StarRating from "@/components/StarRating";

const Profile = () => {
  // For demo purposes, creating some user activity data
  const recentReviews = sampleMatches.slice(0, 3).map((match, index) => ({
    id: `review-${index}`,
    match,
    rating: Math.random() * 2 + 3, // Random rating between 3-5
    date: new Date(Date.now() - index * 86400000 * 2).toISOString(), // Last few days
    comment: [
      "Great match with incredible goals! The atmosphere was electric.",
      "A bit disappointing honestly, expected more from these teams.",
      "One of the best matches I've seen this season, full of drama.",
    ][index],
  }));

  const watchedMatches = sampleMatches.slice(1, 4);
  const wishlistMatches = sampleMatches.slice(4, 7);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <UserProfileCard user={currentUser} />
            
            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Stats & Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Most Reviewed Leagues</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Premier League</span>
                        <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-soccer-grass h-2.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Champions League</span>
                        <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-soccer-grass h-2.5 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>La Liga</span>
                        <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-soccer-grass h-2.5 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Average Ratings</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-xs text-muted-foreground">My Average</span>
                        <div className="text-3xl font-bold text-primary">4.2</div>
                        <StarRating readOnly initialRating={4.2} size={16} />
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-xs text-muted-foreground">Community</span>
                        <div className="text-3xl font-bold text-secondary">3.8</div>
                        <StarRating readOnly initialRating={3.8} size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* User Activity */}
          <div className="md:col-span-2">
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="reviews" className="flex items-center">
                  <Star className="w-4 h-4 mr-2" /> My Reviews
                </TabsTrigger>
                <TabsTrigger value="watched" className="flex items-center">
                  <EyeIcon className="w-4 h-4 mr-2" /> Watched
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="flex items-center">
                  <ListChecks className="w-4 h-4 mr-2" /> Wishlist
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews" className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Star className="mr-2 text-soccer-score" /> Your Reviews
                </h2>
                
                {recentReviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      <div className="md:col-span-1 border-r">
                        <MatchCard match={review.match} variant="compact" />
                      </div>
                      <div className="md:col-span-3 p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <StarRating readOnly initialRating={review.rating} />
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-foreground">{review.comment}</p>
                          </div>
                          <div>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">View All Reviews</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="watched" className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <EyeIcon className="mr-2 text-primary" /> Watched Matches
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {watchedMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">View All Watched</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="wishlist" className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <ListChecks className="mr-2 text-primary" /> Your Wishlist
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {wishlistMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">View Full Wishlist</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Footer would go here - same as home page */}
    </div>
  );
};

export default Profile;

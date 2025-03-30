
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { Play, MessageSquare, Share } from "lucide-react";
import { Link } from "react-router-dom";
import type { Match } from "./MatchCard";

interface FeaturedMatchProps {
  match: Match;
  highlightUrl?: string;
}

const FeaturedMatch = ({ match, highlightUrl }: FeaturedMatchProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
          <img 
            src={highlightUrl || "https://images.unsplash.com/photo-1508098682722-e99c643e7485?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3"} 
            alt="Match highlight"
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <Badge className="bg-soccer-score text-soccer-night border-0 mb-2">Match of the Day</Badge>
              <h2 className="text-2xl font-bold">{match.homeTeam.name} vs {match.awayTeam.name}</h2>
              <p className="text-white/80">{match.competition}</p>
            </div>
            <div className="bg-black/50 rounded-lg p-2">
              <div className="text-3xl font-bold">
                {match.homeTeam.score} - {match.awayTeam.score}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <StarRating readOnly initialRating={match.rating || 0} size={20} />
            <span className="text-white/80">({match.reviewCount || 0} reviews)</span>
          </div>
          
          <div className="flex gap-2">
            <Button className="bg-soccer-score hover:bg-yellow-500 text-black">
              <Play className="w-4 h-4 mr-2" /> Watch Highlights
            </Button>
            <Button variant="outline" className="border-white/20 bg-black/30 backdrop-blur-sm hover:bg-black/50">
              <MessageSquare className="w-4 h-4 mr-2" /> Add Review
            </Button>
            <Button variant="outline" className="border-white/20 bg-black/30 backdrop-blur-sm hover:bg-black/50">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedMatch;

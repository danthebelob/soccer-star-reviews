
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare, Share } from "lucide-react";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";

export interface Match {
  id: string;
  homeTeam: {
    name: string;
    logo: string;
    score: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score: number;
  };
  date: string;
  time: string;
  competition: string;
  isLive?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

interface MatchCardProps {
  match: Match;
  variant?: 'default' | 'compact' | 'featured';
}

const MatchCard = ({ match, variant = 'default' }: MatchCardProps) => {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';
  
  const formattedDate = new Date(match.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className={`match-card h-full overflow-hidden ${isFeatured ? 'border-soccer-score' : ''}`}>
      {match.isLive && (
        <div className="bg-red-600 text-white text-xs font-semibold text-center py-1 px-2">
          LIVE
        </div>
      )}
      
      <CardHeader className={`pb-2 ${isFeatured ? 'bg-gradient-to-r from-soccer-grass to-green-700 text-white' : ''}`}>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className={`${isFeatured ? 'bg-white/20 text-white border-white/30' : ''}`}>
            {match.competition}
          </Badge>
          {match.rating !== undefined && (
            <div className="flex items-center gap-1">
              <StarRating readOnly initialRating={match.rating} size={16} />
              {match.reviewCount && (
                <span className="text-xs text-muted-foreground">({match.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`pt-4 ${isCompact ? 'pb-2' : ''}`}>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-7 items-center">
            {/* Home Team */}
            <div className="col-span-3 text-right">
              <div className="flex flex-col items-end gap-1">
                <span className="font-semibold">{match.homeTeam.name}</span>
                <img 
                  src={match.homeTeam.logo} 
                  alt={match.homeTeam.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/32?text=Team';
                  }}
                />
              </div>
            </div>
            
            {/* Score */}
            <div className="col-span-1 mx-auto px-3 text-center">
              <div className={`font-bold text-xl ${match.isLive ? 'text-red-600' : ''}`}>
                {match.homeTeam.score} - {match.awayTeam.score}
              </div>
            </div>
            
            {/* Away Team */}
            <div className="col-span-3 text-left">
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold">{match.awayTeam.name}</span>
                <img 
                  src={match.awayTeam.logo} 
                  alt={match.awayTeam.name} 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/32?text=Team';
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center text-sm text-muted-foreground gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{match.time}</span>
            </div>
          </div>
          
          {!isCompact && match.tags && match.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {match.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {!isCompact && (
        <CardFooter className="flex justify-between pt-0">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/matches/${match.id}`}>
              <MessageSquare className="w-4 h-4 mr-1" /> Review
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4 mr-1" /> Share
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MatchCard;

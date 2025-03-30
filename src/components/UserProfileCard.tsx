
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, EyeIcon, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfileCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    favoriteTeam?: string;
    reviewCount: number;
    watchedCount: number;
    wishlistCount: number;
    badges?: string[];
  };
  className?: string;
}

const UserProfileCard = ({ user, className }: UserProfileCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-soccer-grass to-green-700 pb-14 relative">
        <div className="absolute top-3 right-3">
          <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
            <Link to="/profile/edit">Edit Profile</Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative">
        <div className="flex flex-col items-center -mt-12 mb-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-2xl bg-soccer-score text-soccer-night">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold mt-3">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
          
          {user.favoriteTeam && (
            <div className="flex items-center gap-2 mt-2">
              <Trophy className="w-4 h-4 text-soccer-score" />
              <span className="text-sm">{user.favoriteTeam} Fan</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold">{user.reviewCount}</span>
            <span className="text-xs text-muted-foreground">Reviews</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
              <EyeIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold">{user.watchedCount}</span>
            <span className="text-xs text-muted-foreground">Watched</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold">{user.wishlistCount}</span>
            <span className="text-xs text-muted-foreground">Wishlist</span>
          </div>
        </div>
        
        {user.badges && user.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {user.badges.map((badge, index) => (
              <Badge key={index} variant="secondary">{badge}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center gap-2 border-t pt-4 bg-muted/30">
        <Button asChild variant="outline">
          <Link to="/profile/reviews">My Reviews</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/profile/watched">Watched</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/profile/wishlist">Wishlist</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfileCard;

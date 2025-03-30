
import { useQuery } from "@tanstack/react-query";
import { Users, MessageSquare, Star, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mockup de dados enquanto não temos API de comunidade
const communityMembers = [
  {
    id: 1,
    name: "João Silva",
    username: "joaosilva",
    avatar: "",
    reviewCount: 157,
    joinedDate: "Jan 2023",
    favoriteTeam: "Flamengo"
  },
  {
    id: 2,
    name: "Maria Oliveira",
    username: "mariaoliv",
    avatar: "",
    reviewCount: 132,
    joinedDate: "Mar 2023",
    favoriteTeam: "Palmeiras"
  },
  {
    id: 3,
    name: "Pedro Santos",
    username: "pedrosantos",
    avatar: "",
    reviewCount: 98,
    joinedDate: "Fev 2023",
    favoriteTeam: "São Paulo"
  },
  {
    id: 4,
    name: "Ana Costa",
    username: "anacosta",
    avatar: "",
    reviewCount: 78,
    joinedDate: "Abr 2023",
    favoriteTeam: "Corinthians"
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    username: "carlosferr",
    avatar: "",
    reviewCount: 64,
    joinedDate: "Mai 2023",
    favoriteTeam: "Grêmio"
  },
  {
    id: 6,
    name: "Fernanda Lima",
    username: "fernandal",
    avatar: "",
    reviewCount: 57,
    joinedDate: "Jun 2023",
    favoriteTeam: "Internacional"
  }
];

const communityReviews = [
  {
    id: 1,
    user: {
      name: "João Silva",
      username: "joaosilva",
      avatar: ""
    },
    matchTitle: "Flamengo vs Fluminense",
    rating: 4.5,
    comment: "Partida incrível, muitos gols e lances de emoção!",
    date: "2 horas atrás",
    likes: 24
  },
  {
    id: 2,
    user: {
      name: "Maria Oliveira",
      username: "mariaoliv",
      avatar: ""
    },
    matchTitle: "Palmeiras vs Corinthians",
    rating: 5,
    comment: "Melhor clássico dos últimos anos, valeu cada minuto!",
    date: "5 horas atrás",
    likes: 19
  },
  {
    id: 3,
    user: {
      name: "Pedro Santos",
      username: "pedrosantos",
      avatar: ""
    },
    matchTitle: "São Paulo vs Santos",
    rating: 3.5,
    comment: "Jogo bom, mas esperava mais emoção no clássico.",
    date: "1 dia atrás",
    likes: 12
  }
];

const Comunidade = () => {
  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center mb-6 gap-2">
        <Users className="w-6 h-6 text-blue-500" />
        <h1 className="text-3xl font-bold">Comunidade</h1>
      </div>
      
      <p className="mb-6 text-gray-600">
        Conecte-se com outros amantes do futebol, veja avaliações e participe da discussão sobre seus jogos favoritos.
      </p>

      <Tabs defaultValue="membros" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="membros" className="gap-2">
            <Users className="w-4 h-4" /> Membros
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            <MessageSquare className="w-4 h-4" /> Avaliações Recentes
          </TabsTrigger>
          <TabsTrigger value="ranking" className="gap-2">
            <Trophy className="w-4 h-4" /> Ranking
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="membros">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communityMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-500">@{member.username}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {member.reviewCount} avaliações
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {member.favoriteTeam}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="space-y-4">
            {communityReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{review.user.name}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">@{review.user.username} • {review.date}</p>
                      <h4 className="mt-2 font-medium">{review.matchTitle}</h4>
                      <p className="mt-1 text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ranking">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold">Top Avaliadores</h3>
              <div className="space-y-4">
                {communityMembers
                  .sort((a, b) => b.reviewCount - a.reviewCount)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full">
                        {index + 1}
                      </div>
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-gray-500">@{member.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{member.reviewCount}</p>
                        <p className="text-xs text-gray-500">avaliações</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Comunidade;

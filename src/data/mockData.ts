
import type { Match } from "@/components/MatchCard";

export const sampleMatches: Match[] = [
  {
    id: "1",
    homeTeam: {
      name: "Argentina",
      logo: "https://media.api-sports.io/football/teams/26.png",
      score: 3
    },
    awayTeam: {
      name: "France",
      logo: "https://media.api-sports.io/football/teams/2.png",
      score: 3
    },
    date: "2022-12-18",
    time: "15:00",
    competition: "World Cup 2022 Final",
    rating: 5,
    reviewCount: 1283,
    tags: ["World Cup", "Final", "Penalties", "Historic"]
  },
  {
    id: "2",
    homeTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      score: 4
    },
    awayTeam: {
      name: "Real Madrid",
      logo: "https://media.api-sports.io/football/teams/541.png",
      score: 0
    },
    date: "2023-10-28",
    time: "20:00",
    competition: "La Liga",
    rating: 4.5,
    reviewCount: 856,
    tags: ["El Clásico", "Derby"]
  },
  {
    id: "3",
    homeTeam: {
      name: "Manchester City",
      logo: "https://media.api-sports.io/football/teams/50.png",
      score: 2
    },
    awayTeam: {
      name: "Liverpool",
      logo: "https://media.api-sports.io/football/teams/40.png",
      score: 2
    },
    date: "2023-11-05",
    time: "16:30",
    competition: "Premier League",
    isLive: true,
    rating: 4,
    reviewCount: 327,
    tags: ["Thriller", "Comeback"]
  },
  {
    id: "4",
    homeTeam: {
      name: "Bayern Munich",
      logo: "https://media.api-sports.io/football/teams/157.png",
      score: 3
    },
    awayTeam: {
      name: "Dortmund",
      logo: "https://media.api-sports.io/football/teams/165.png",
      score: 1
    },
    date: "2023-11-01",
    time: "18:30",
    competition: "Bundesliga",
    rating: 3.5,
    reviewCount: 410,
    tags: ["Der Klassiker", "Derby"]
  },
  {
    id: "5",
    homeTeam: {
      name: "Milan",
      logo: "https://media.api-sports.io/football/teams/489.png",
      score: 1
    },
    awayTeam: {
      name: "Inter",
      logo: "https://media.api-sports.io/football/teams/505.png",
      score: 2
    },
    date: "2023-09-17",
    time: "20:45",
    competition: "Serie A",
    rating: 4,
    reviewCount: 521,
    tags: ["Derby della Madonnina", "Intense"]
  },
  {
    id: "6",
    homeTeam: {
      name: "Flamengo",
      logo: "https://media.api-sports.io/football/teams/127.png",
      score: 2
    },
    awayTeam: {
      name: "Palmeiras",
      logo: "https://media.api-sports.io/football/teams/121.png",
      score: 0
    },
    date: "2023-11-08",
    time: "20:00",
    competition: "Copa Libertadores",
    rating: 3.5,
    reviewCount: 278,
    tags: ["Final", "South American"]
  }
];

export const upcomingMatches: Match[] = [
  {
    id: "7",
    homeTeam: {
      name: "Arsenal",
      logo: "https://media.api-sports.io/football/teams/42.png",
      score: 0
    },
    awayTeam: {
      name: "Chelsea",
      logo: "https://media.api-sports.io/football/teams/49.png",
      score: 0
    },
    date: "2023-12-02",
    time: "17:30",
    competition: "Premier League",
    tags: ["London Derby"]
  },
  {
    id: "8",
    homeTeam: {
      name: "PSG",
      logo: "https://media.api-sports.io/football/teams/85.png",
      score: 0
    },
    awayTeam: {
      name: "Bayern Munich",
      logo: "https://media.api-sports.io/football/teams/157.png",
      score: 0
    },
    date: "2023-11-22",
    time: "21:00",
    competition: "Champions League",
    tags: ["Group Stage"]
  }
];

export const liveMatches: Match[] = [
  {
    id: "9",
    homeTeam: {
      name: "Juventus",
      logo: "https://media.api-sports.io/football/teams/496.png",
      score: 2
    },
    awayTeam: {
      name: "Napoli",
      logo: "https://media.api-sports.io/football/teams/492.png",
      score: 1
    },
    date: "2023-11-10",
    time: "20:45",
    competition: "Serie A",
    isLive: true,
    tags: ["2nd Half", "75'"]
  },
  {
    id: "10",
    homeTeam: {
      name: "Atlético Madrid",
      logo: "https://media.api-sports.io/football/teams/530.png",
      score: 0
    },
    awayTeam: {
      name: "Sevilla",
      logo: "https://media.api-sports.io/football/teams/536.png",
      score: 0
    },
    date: "2023-11-10",
    time: "21:00",
    competition: "La Liga",
    isLive: true,
    tags: ["1st Half", "32'"]
  }
];

export const currentUser = {
  id: "1",
  name: "Alex Johnson",
  username: "alexj",
  avatar: "https://i.pravatar.cc/300?img=12",
  favoriteTeam: "Arsenal FC",
  reviewCount: 150,
  watchedCount: 217,
  wishlistCount: 43,
  badges: ["Premier League Expert", "World Cup Analyst", "Top Reviewer"]
};

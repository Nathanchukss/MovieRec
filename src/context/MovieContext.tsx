import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Movie, Rating } from "@/types/movie";
import { loadMovies, loadRatings, loadLinks } from "@/lib/dataLoader";
import { ContentBasedRecommender } from "@/lib/contentBasedRecommender";
import { CollaborativeRecommender } from "@/lib/collaborativeRecommender";

interface UserRatings {
  [movieId: number]: number;
}

interface MovieContextType {
  movies: Movie[];
  contentRecommender: ContentBasedRecommender | null;
  collaborativeRecommender: CollaborativeRecommender | null;
  isLoading: boolean;
  userRatings: UserRatings;
  rateMovie: (movieId: number, rating: number) => void;
  getTmdbPosterUrl: (movieId: number) => string | null;
}

const MovieContext = createContext<MovieContextType | null>(null);

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [contentRecommender, setContentRecommender] = useState<ContentBasedRecommender | null>(null);
  const [collaborativeRecommender, setCollaborativeRecommender] = useState<CollaborativeRecommender | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tmdbLinks, setTmdbLinks] = useState<Map<number, number>>(new Map());
  const [userRatings, setUserRatings] = useState<UserRatings>(() => {
    const saved = localStorage.getItem("movieRec_userRatings");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    async function initializeData() {
      try {
        const [moviesData, ratingsData, linksData] = await Promise.all([
          loadMovies(),
          loadRatings(),
          loadLinks(),
        ]);

        setMovies(moviesData);

        // Create TMDB links map
        const tmdbMap = new Map<number, number>();
        linksData.forEach((link, movieId) => {
          if (link.tmdbId) {
            tmdbMap.set(movieId, link.tmdbId);
          }
        });
        setTmdbLinks(tmdbMap);

        // Initialize content-based recommender
        const cbRec = new ContentBasedRecommender();
        cbRec.fit(moviesData);
        setContentRecommender(cbRec);

        // Initialize collaborative recommender
        const collabRec = new CollaborativeRecommender();
        collabRec.fit(moviesData, ratingsData);
        setCollaborativeRecommender(collabRec);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load movie data:", error);
        setIsLoading(false);
      }
    }

    initializeData();
  }, []);

  const rateMovie = (movieId: number, rating: number) => {
    setUserRatings((prev) => {
      const updated = { ...prev, [movieId]: rating };
      localStorage.setItem("movieRec_userRatings", JSON.stringify(updated));
      return updated;
    });
  };

  const getTmdbPosterUrl = (movieId: number): string | null => {
    const tmdbId = tmdbLinks.get(movieId);
    if (!tmdbId) return null;
    // Note: TMDB requires an API key for poster URLs, so we'll use a placeholder approach
    // For now, return null and use a gradient placeholder
    return null;
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        contentRecommender,
        collaborativeRecommender,
        isLoading,
        userRatings,
        rateMovie,
        getTmdbPosterUrl,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
}

import { useState, useEffect } from "react";
import { Movie, MovieWithScore } from "@/types/movie";
import { useMovies } from "@/context/MovieContext";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { MovieCarousel } from "@/components/MovieCarousel";
import { MovieDetail } from "@/components/MovieDetail";
import { Loader2 } from "lucide-react";

const Index = () => {
  const {
    isLoading,
    contentRecommender,
    collaborativeRecommender,
    userRatings,
  } = useMovies();

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<MovieWithScore[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<Movie[]>([]);
  const [personalRecs, setPersonalRecs] = useState<MovieWithScore[]>([]);
  const [basedOnMovie, setBasedOnMovie] = useState<{
    movie: Movie;
    recs: MovieWithScore[];
  } | null>(null);

  // Load initial data
  useEffect(() => {
    if (!contentRecommender || !collaborativeRecommender) return;

    // Get popular movies
    const popular = collaborativeRecommender.getPopularMovies(20);
    setPopularMovies(popular);

    // Get movies by genre
    setActionMovies(contentRecommender.getPopularByGenre("Action", 20));
    setComedyMovies(contentRecommender.getPopularByGenre("Comedy", 20));
    setDramaMovies(contentRecommender.getPopularByGenre("Drama", 20));
    setSciFiMovies(contentRecommender.getPopularByGenre("Sci-Fi", 20));
  }, [contentRecommender, collaborativeRecommender]);

  // Generate personalized recommendations
  useEffect(() => {
    if (!collaborativeRecommender || !contentRecommender) return;

    const ratedMovieIds = Object.keys(userRatings).map(Number);
    
    if (ratedMovieIds.length > 0) {
      // Get collaborative recommendations
      const collabRecs = collaborativeRecommender.recommend(userRatings, 20);
      setPersonalRecs(collabRecs);

      // Get content-based recommendations from highest rated movie
      const highestRated = ratedMovieIds.reduce((best, id) =>
        userRatings[id] > userRatings[best] ? id : best
      );
      const baseMovie = contentRecommender.getMovie(highestRated);
      if (baseMovie) {
        const contentRecs = contentRecommender.recommend(highestRated, 10);
        setBasedOnMovie({ movie: baseMovie, recs: contentRecs });
      }
    } else {
      setPersonalRecs([]);
      setBasedOnMovie(null);
    }
  }, [userRatings, collaborativeRecommender, contentRecommender]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading movie database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Search */}
      <section className="pt-24 pb-12 px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Your Next Favorite Movie
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Search for a movie to get personalized recommendations powered by AI
          </p>
          <div className="flex justify-center">
            <SearchBar onMovieSelect={setSelectedMovie} />
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      {personalRecs.length > 0 && (
        <MovieCarousel
          title="🎯 Recommended for You"
          movies={personalRecs}
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* Based on your highest rated */}
      {basedOnMovie && (
        <MovieCarousel
          title={`Because you liked "${basedOnMovie.movie.title.replace(/\s*\(\d{4}\)$/, '')}"`}
          movies={basedOnMovie.recs}
          onMovieClick={setSelectedMovie}
        />
      )}

      {/* Popular Movies */}
      <MovieCarousel
        title="🔥 Popular Movies"
        movies={popularMovies}
        onMovieClick={setSelectedMovie}
      />

      {/* Genre Carousels */}
      <MovieCarousel
        title="💥 Action"
        movies={actionMovies}
        onMovieClick={setSelectedMovie}
      />

      <MovieCarousel
        title="😂 Comedy"
        movies={comedyMovies}
        onMovieClick={setSelectedMovie}
      />

      <MovieCarousel
        title="🎭 Drama"
        movies={dramaMovies}
        onMovieClick={setSelectedMovie}
      />

      <MovieCarousel
        title="🚀 Sci-Fi"
        movies={sciFiMovies}
        onMovieClick={setSelectedMovie}
      />

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Index;

import { Movie, MovieWithScore } from "@/types/movie";
import { useMovies } from "@/context/MovieContext";
import { X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

function getGradientFromTitle(title: string): string {
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 30%), hsl(${hue2}, 60%, 20%))`;
}

export function MovieDetail({ movie, onClose }: MovieDetailProps) {
  const { contentRecommender, userRatings, rateMovie } = useMovies();
  const [recommendations, setRecommendations] = useState<MovieWithScore[]>([]);
  const userRating = userRatings[movie.movieId];

  useEffect(() => {
    if (contentRecommender) {
      const recs = contentRecommender.recommend(movie.movieId, 6);
      setRecommendations(recs);
    }
  }, [movie, contentRecommender]);

  const handleRate = (rating: number) => {
    rateMovie(movie.movieId, rating);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Section */}
        <div
          className="relative h-64 md:h-80"
          style={{ background: getGradientFromTitle(movie.title) }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 -mt-20 relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {movie.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-colors",
                      userRating && userRating >= star
                        ? "fill-primary text-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Similar Movies */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Similar Movies
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.movieId}
                    className="p-3 bg-secondary rounded-lg"
                  >
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {rec.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(rec.score * 100).toFixed(0)}% match
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

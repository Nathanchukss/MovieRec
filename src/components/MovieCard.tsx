import { Movie } from "@/types/movie";
import { Star } from "lucide-react";
import { useMovies } from "@/context/MovieContext";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  showRating?: boolean;
}

// Generate a consistent color based on movie title
function getGradientFromTitle(title: string): string {
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 25%), hsl(${hue2}, 60%, 15%))`;
}

export function MovieCard({ movie, onClick, showRating = true }: MovieCardProps) {
  const { userRatings, rateMovie } = useMovies();
  const userRating = userRatings[movie.movieId];

  const handleRate = (e: React.MouseEvent, rating: number) => {
    e.stopPropagation();
    rateMovie(movie.movieId, rating);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 w-[180px] h-[270px] rounded-md overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-primary/20"
      )}
    >
      {/* Poster Placeholder with Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: getGradientFromTitle(movie.title) }}
      />

      {/* Movie Info Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-[10px] px-1.5 py-0.5 bg-secondary/80 rounded text-muted-foreground"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Rating Stars (visible on hover) */}
        {showRating && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={(e) => handleRate(e, star)}
                className="p-0.5 hover:scale-110 transition-transform"
              >
                <Star
                  className={cn(
                    "w-4 h-4 transition-colors",
                    userRating && userRating >= star
                      ? "fill-primary text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Rating Badge */}
      {userRating && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-primary/90 text-primary-foreground px-1.5 py-0.5 rounded text-xs font-medium">
          <Star className="w-3 h-3 fill-current" />
          {userRating}
        </div>
      )}
    </div>
  );
}

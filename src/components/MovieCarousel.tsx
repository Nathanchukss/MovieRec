import { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export function MovieCarousel({ title, movies, onMovieClick }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 600;
    const newPosition =
      scrollRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);
    scrollRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  if (movies.length === 0) return null;

  return (
    <div className="relative group/carousel mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4 px-4 md:px-12">
        {title}
      </h2>

      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-full",
          "bg-gradient-to-r from-background to-transparent",
          "flex items-center justify-start pl-1",
          "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
          !showLeftArrow && "hidden"
        )}
      >
        <ChevronLeft className="w-8 h-8 text-foreground" />
      </button>

      {/* Movie List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-4"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.movieId}
            movie={movie}
            onClick={() => onMovieClick?.(movie)}
          />
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-full",
          "bg-gradient-to-l from-background to-transparent",
          "flex items-center justify-end pr-1",
          "opacity-0 group-hover/carousel:opacity-100 transition-opacity",
          !showRightArrow && "hidden"
        )}
      >
        <ChevronRight className="w-8 h-8 text-foreground" />
      </button>
    </div>
  );
}

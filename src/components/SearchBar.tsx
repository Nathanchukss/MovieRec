import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Movie } from "@/types/movie";
import { useMovies } from "@/context/MovieContext";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onMovieSelect: (movie: Movie) => void;
}

export function SearchBar({ onMovieSelect }: SearchBarProps) {
  const { contentRecommender } = useMovies();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRecommender || query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults = contentRecommender.searchByTitle(query, 8);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, contentRecommender]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    onMovieSelect(movie);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a movie..."
          className={cn(
            "w-full pl-12 pr-10 py-3 rounded-lg",
            "bg-secondary border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition-all"
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {results.map((movie, index) => (
            <button
              key={movie.movieId}
              onClick={() => handleSelect(movie)}
              className={cn(
                "w-full px-4 py-3 text-left flex items-center gap-3",
                "hover:bg-secondary transition-colors",
                index === selectedIndex && "bg-secondary"
              )}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{movie.title}</p>
                <p className="text-xs text-muted-foreground">
                  {movie.genres.slice(0, 3).join(" • ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

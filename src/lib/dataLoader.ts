import { Movie, Rating, MovieLink } from "@/types/movie";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function extractYear(title: string): { cleanTitle: string; year?: number } {
  const match = title.match(/\((\d{4})\)\s*$/);
  if (match) {
    return {
      cleanTitle: title,
      year: parseInt(match[1], 10),
    };
  }
  return { cleanTitle: title };
}

export async function loadMovies(): Promise<Movie[]> {
  const response = await fetch("/data/movies.csv");
  const text = await response.text();
  const lines = text.trim().split("\n");

  // Skip header
  const movies: Movie[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [movieIdStr, title, genresStr] = parseCSVLine(lines[i]);
    const movieId = parseInt(movieIdStr, 10);
    const genres = genresStr ? genresStr.split("|").filter(Boolean) : [];
    const { year } = extractYear(title);

    movies.push({
      movieId,
      title,
      genres,
      year,
    });
  }

  return movies;
}

export async function loadRatings(): Promise<Rating[]> {
  const response = await fetch("/data/ratings.csv");
  const text = await response.text();
  const lines = text.trim().split("\n");

  const ratings: Rating[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    ratings.push({
      userId: parseInt(parts[0], 10),
      movieId: parseInt(parts[1], 10),
      rating: parseFloat(parts[2]),
    });
  }

  return ratings;
}

export async function loadLinks(): Promise<Map<number, MovieLink>> {
  const response = await fetch("/data/links.csv");
  const text = await response.text();
  const lines = text.trim().split("\n");

  const links = new Map<number, MovieLink>();
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const movieId = parseInt(parts[0], 10);
    links.set(movieId, {
      movieId,
      imdbId: parts[1],
      tmdbId: parseInt(parts[2], 10) || 0,
    });
  }

  return links;
}

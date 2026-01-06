export interface Movie {
  movieId: number;
  title: string;
  genres: string[];
  year?: number;
  tmdbId?: number;
  imdbId?: string;
}

export interface Rating {
  userId: number;
  movieId: number;
  rating: number;
}

export interface MovieLink {
  movieId: number;
  imdbId: string;
  tmdbId: number;
}

export interface MovieWithScore extends Movie {
  score: number;
}

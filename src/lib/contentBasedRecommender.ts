import { Movie, MovieWithScore } from "@/types/movie";
import { TfidfVectorizer, TfidfVector, computeSimilarities } from "./tfidf";

export class ContentBasedRecommender {
  private movies: Movie[] = [];
  private vectorizer: TfidfVectorizer;
  private tfidfVectors: TfidfVector[] = [];
  private movieIndexMap: Map<number, number> = new Map();

  constructor() {
    this.vectorizer = new TfidfVectorizer();
  }

  fit(movies: Movie[]): void {
    this.movies = movies;

    // Create index mapping
    movies.forEach((movie, index) => {
      this.movieIndexMap.set(movie.movieId, index);
    });

    // Prepare documents (genres as terms)
    const documents = movies.map((movie) =>
      movie.genres.map((g) => g.toLowerCase())
    );

    // Fit and transform
    this.vectorizer.fit(documents);
    this.tfidfVectors = this.vectorizer.transform(documents);
  }

  recommend(movieId: number, topN: number = 10): MovieWithScore[] {
    const idx = this.movieIndexMap.get(movieId);
    if (idx === undefined) {
      return [];
    }

    const queryVector = this.tfidfVectors[idx];
    const similarities = computeSimilarities(queryVector, this.tfidfVectors);

    // Get top N similar movies (excluding the query movie itself)
    const scored: { index: number; score: number }[] = similarities
      .map((score, index) => ({ index, score }))
      .filter((item) => item.index !== idx && item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return scored.map((item) => ({
      ...this.movies[item.index],
      score: item.score,
    }));
  }

  getMovie(movieId: number): Movie | undefined {
    const idx = this.movieIndexMap.get(movieId);
    return idx !== undefined ? this.movies[idx] : undefined;
  }

  searchByTitle(query: string, limit: number = 20): Movie[] {
    const lowerQuery = query.toLowerCase();
    return this.movies
      .filter((movie) => movie.title.toLowerCase().includes(lowerQuery))
      .slice(0, limit);
  }

  getPopularByGenre(genre: string, limit: number = 20): Movie[] {
    return this.movies
      .filter((movie) =>
        movie.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
      )
      .slice(0, limit);
  }

  getAllGenres(): string[] {
    const genreSet = new Set<string>();
    this.movies.forEach((movie) => {
      movie.genres.forEach((g) => genreSet.add(g));
    });
    return Array.from(genreSet).sort();
  }

  getRandomMovies(count: number): Movie[] {
    const shuffled = [...this.movies].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}

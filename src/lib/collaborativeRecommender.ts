import { Movie, Rating, MovieWithScore } from "@/types/movie";

interface UserRatings {
  [movieId: number]: number;
}

export class CollaborativeRecommender {
  private movies: Map<number, Movie> = new Map();
  private userRatings: Map<number, UserRatings> = new Map();
  private movieRatings: Map<number, { sum: number; count: number }> = new Map();

  fit(movies: Movie[], ratings: Rating[]): void {
    // Index movies
    movies.forEach((movie) => {
      this.movies.set(movie.movieId, movie);
    });

    // Build user-movie rating matrix
    ratings.forEach((rating) => {
      if (!this.userRatings.has(rating.userId)) {
        this.userRatings.set(rating.userId, {});
      }
      this.userRatings.get(rating.userId)![rating.movieId] = rating.rating;

      // Aggregate movie ratings
      if (!this.movieRatings.has(rating.movieId)) {
        this.movieRatings.set(rating.movieId, { sum: 0, count: 0 });
      }
      const mr = this.movieRatings.get(rating.movieId)!;
      mr.sum += rating.rating;
      mr.count += 1;
    });
  }

  // Cosine similarity between two users
  private userSimilarity(user1: UserRatings, user2: UserRatings): number {
    const commonMovies = Object.keys(user1)
      .map(Number)
      .filter((movieId) => movieId in user2);

    if (commonMovies.length === 0) return 0;

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    commonMovies.forEach((movieId) => {
      const r1 = user1[movieId];
      const r2 = user2[movieId];
      dotProduct += r1 * r2;
      norm1 += r1 * r1;
      norm2 += r2 * r2;
    });

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator > 0 ? dotProduct / denominator : 0;
  }

  // Find similar users to the current user's ratings
  private findSimilarUsers(
    userRatings: UserRatings,
    topK: number = 20
  ): { userId: number; similarity: number }[] {
    const similarities: { userId: number; similarity: number }[] = [];

    this.userRatings.forEach((otherRatings, userId) => {
      const sim = this.userSimilarity(userRatings, otherRatings);
      if (sim > 0) {
        similarities.push({ userId, similarity: sim });
      }
    });

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  }

  // Recommend movies based on user's ratings
  recommend(userRatings: UserRatings, topN: number = 10): MovieWithScore[] {
    if (Object.keys(userRatings).length === 0) {
      // Return popular movies if no ratings
      return this.getPopularMovies(topN);
    }

    const similarUsers = this.findSimilarUsers(userRatings);
    const movieScores = new Map<number, { weightedSum: number; simSum: number }>();

    // Aggregate ratings from similar users
    similarUsers.forEach(({ userId, similarity }) => {
      const ratings = this.userRatings.get(userId)!;
      Object.entries(ratings).forEach(([movieIdStr, rating]) => {
        const movieId = parseInt(movieIdStr, 10);
        // Skip movies user has already rated
        if (movieId in userRatings) return;

        if (!movieScores.has(movieId)) {
          movieScores.set(movieId, { weightedSum: 0, simSum: 0 });
        }
        const ms = movieScores.get(movieId)!;
        ms.weightedSum += similarity * rating;
        ms.simSum += similarity;
      });
    });

    // Calculate predicted ratings
    const predictions: { movieId: number; score: number }[] = [];
    movieScores.forEach(({ weightedSum, simSum }, movieId) => {
      if (simSum > 0 && this.movies.has(movieId)) {
        predictions.push({
          movieId,
          score: weightedSum / simSum,
        });
      }
    });

    // Sort by predicted score
    predictions.sort((a, b) => b.score - a.score);

    return predictions.slice(0, topN).map((p) => ({
      ...this.movies.get(p.movieId)!,
      score: p.score,
    }));
  }

  getPopularMovies(topN: number = 10): MovieWithScore[] {
    const scored: { movieId: number; avgRating: number; count: number }[] = [];

    this.movieRatings.forEach(({ sum, count }, movieId) => {
      if (count >= 10 && this.movies.has(movieId)) {
        scored.push({
          movieId,
          avgRating: sum / count,
          count,
        });
      }
    });

    // Sort by average rating (with popularity consideration)
    scored.sort((a, b) => {
      // Weighted score: avgRating * log(count + 1) for popularity boost
      const scoreA = a.avgRating * Math.log(a.count + 1);
      const scoreB = b.avgRating * Math.log(b.count + 1);
      return scoreB - scoreA;
    });

    return scored.slice(0, topN).map((s) => ({
      ...this.movies.get(s.movieId)!,
      score: s.avgRating,
    }));
  }
}

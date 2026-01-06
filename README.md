# MovieRec 🎬

A Netflix-style movie recommendation engine built with React and TypeScript, featuring content-based and collaborative filtering algorithms.

![MovieRec](https://img.shields.io/badge/Movies-9700%2B-red) ![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Overview

MovieRec provides personalized movie recommendations using the MovieLens dataset (9,700+ movies, 100K+ ratings). The app combines two powerful recommendation approaches:

- **Content-Based Filtering**: Recommends movies similar to ones you like based on genre analysis using TF-IDF vectorization and cosine similarity
- **Collaborative Filtering**: Suggests movies based on what similar users enjoyed, using user-item rating patterns

## Origin Story

This project was **originally developed in Python** using popular data science libraries (pandas, NumPy, scikit-learn) for feature extraction and similarity computation. The initial implementation included:

- TF-IDF vectorization with `TfidfVectorizer` from scikit-learn
- Cosine similarity calculations using `sklearn.metrics.pairwise`
- User-based collaborative filtering with rating matrices

The entire recommendation engine was then **transitioned to TypeScript** to run entirely in the browser, eliminating the need for a backend server while maintaining the same algorithmic approach.

## Features

- 🔍 **Movie Search** - Find movies by title with instant results
- ⭐ **Rate Movies** - 5-star rating system stored locally
- 🎯 **Personalized Recommendations** - Get suggestions based on your ratings
- 🎬 **"Because You Liked..."** - Content-based similar movie suggestions
- 📊 **Trending & Top Rated** - Discover popular movies
- 🌙 **Netflix-Style UI** - Dark theme with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **State Management**: React Context API
- **Data**: MovieLens 100K Dataset
- **Algorithms**: Custom TF-IDF & Cosine Similarity implementation

## How It Works

### Content-Based Filtering
1. Extracts genre features from each movie
2. Applies TF-IDF (Term Frequency-Inverse Document Frequency) weighting
3. Computes cosine similarity between movie vectors
4. Returns top-N most similar movies

### Collaborative Filtering
1. Builds a user-item rating matrix
2. Calculates similarity between users based on rating patterns
3. Predicts ratings for unseen movies using weighted averages
4. Recommends highest predicted-rating movies

## Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd movierec

# Install dependencies
npm install

# Start development server
npm run dev
```

## Dataset

This project uses the [MovieLens 100K Dataset](https://grouplens.org/datasets/movielens/):
- `movies.csv` - 9,742 movies with titles and genres
- `ratings.csv` - 100,836 ratings from 610 users
- `links.csv` - TMDB/IMDB identifiers for poster images

## License

MIT License - feel free to use and modify for your own projects!

---

Built with ❤️ using [Lovable](https://lovable.dev)

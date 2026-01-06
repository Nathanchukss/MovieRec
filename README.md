# MovieRec 🎬

A Netflix-style movie recommendation engine built with React and TypeScript, featuring content-based and collaborative filtering algorithms.

![MovieRec](https://img.shields.io/badge/Movies-9700%2B-red) ![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Overview

MovieRec provides personalized movie recommendations using the MovieLens dataset (9,700+ movies, 100K+ ratings). The app combines two powerful recommendation approaches:

- **Content-Based Filtering**: Recommends movies similar to ones you like based on genre analysis using TF-IDF vectorization and cosine similarity
- **Collaborative Filtering**: Suggests movies based on what similar users enjoyed, using user-item rating patterns

## Origin Story: From Python to TypeScript

This project was **originally developed in Python** using popular data science libraries for feature extraction and similarity computation:

```python
# Original Python implementation
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# TF-IDF vectorization on movie genres
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['genres'])

# Compute cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
```

The original Python stack included:
- **pandas** for data manipulation and CSV parsing
- **NumPy** for numerical operations and matrix handling
- **scikit-learn** for TF-IDF vectorization and cosine similarity
- User-based collaborative filtering with rating matrices

### Why Transition to TypeScript?

The entire recommendation engine was **rewritten in TypeScript** to:
- ✅ Run entirely in the browser with no backend required
- ✅ Eliminate server costs and API latency
- ✅ Provide instant recommendations without network calls
- ✅ Enable easy deployment as a static site

The same algorithms (TF-IDF, cosine similarity, collaborative filtering) were implemented from scratch in TypeScript, maintaining identical recommendation quality while gaining the benefits of a client-side architecture.

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

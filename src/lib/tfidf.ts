// TF-IDF Vectorizer and Cosine Similarity implementation in TypeScript
// Ported from Python's sklearn approach

export interface TfidfVector {
  terms: Map<string, number>;
  norm: number;
}

export class TfidfVectorizer {
  private vocabulary: Map<string, number> = new Map();
  private idf: Map<string, number> = new Map();
  private documents: string[][] = [];

  fit(documents: string[][]): void {
    this.documents = documents;
    const docCount = documents.length;
    const termDocFreq = new Map<string, number>();

    // Build vocabulary and document frequencies
    documents.forEach((doc) => {
      const uniqueTerms = new Set(doc);
      uniqueTerms.forEach((term) => {
        if (!this.vocabulary.has(term)) {
          this.vocabulary.set(term, this.vocabulary.size);
        }
        termDocFreq.set(term, (termDocFreq.get(term) || 0) + 1);
      });
    });

    // Calculate IDF: log((1 + n) / (1 + df)) + 1
    this.vocabulary.forEach((_, term) => {
      const df = termDocFreq.get(term) || 0;
      const idfValue = Math.log((1 + docCount) / (1 + df)) + 1;
      this.idf.set(term, idfValue);
    });
  }

  transform(documents: string[][]): TfidfVector[] {
    return documents.map((doc) => this.transformSingle(doc));
  }

  transformSingle(document: string[]): TfidfVector {
    // Calculate term frequency
    const tf = new Map<string, number>();
    document.forEach((term) => {
      tf.set(term, (tf.get(term) || 0) + 1);
    });

    // Calculate TF-IDF scores
    const terms = new Map<string, number>();
    let sumSquares = 0;

    tf.forEach((count, term) => {
      const idfValue = this.idf.get(term) || 0;
      const tfidfScore = count * idfValue;
      terms.set(term, tfidfScore);
      sumSquares += tfidfScore * tfidfScore;
    });

    // L2 normalization
    const norm = Math.sqrt(sumSquares);
    if (norm > 0) {
      terms.forEach((value, key) => {
        terms.set(key, value / norm);
      });
    }

    return { terms, norm };
  }
}

export function cosineSimilarity(vec1: TfidfVector, vec2: TfidfVector): number {
  let dotProduct = 0;

  vec1.terms.forEach((value, term) => {
    const otherValue = vec2.terms.get(term);
    if (otherValue !== undefined) {
      dotProduct += value * otherValue;
    }
  });

  // Vectors are already L2 normalized, so we just return the dot product
  return dotProduct;
}

// Batch similarity calculation for performance
export function computeSimilarities(
  queryVector: TfidfVector,
  allVectors: TfidfVector[]
): number[] {
  return allVectors.map((vec) => cosineSimilarity(queryVector, vec));
}

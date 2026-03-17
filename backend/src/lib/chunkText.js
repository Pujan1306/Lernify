export const chunkText = (text, options = {}) => {
  const {
    maxChars = 1000,
    overlapSentences = 1,
    minChunkChars = 200
  } = options;

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("chunkText: invalid text input");
  }

  if (maxChars <= minChunkChars) {
    throw new Error("maxChars must be greater than minChunkChars");
  }

  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const sentences =
    normalized.match(/[^.!?\n]+(?:[.!?]+|\n+|$)/g) || [];

  const chunks = [];
  let buffer = [];
  let bufferLength = 0;
  let chunkIndex = 0;

  const flush = () => {
    if (bufferLength === 0) return;

    const content = buffer.join("").trim();

    if (content.length < minChunkChars && chunks.length > 0) {
      chunks[chunks.length - 1].content += " " + content;
      return;
    }

    chunks.push({
      content,
      chunkIndex
    });

    chunkIndex++;

    buffer = buffer.slice(-overlapSentences);
    bufferLength = buffer.reduce((a, s) => a + s.length, 0);
  };

  for (const sentence of sentences) {
    if (sentence.length > maxChars) {
      flush();

      let start = 0;
      while (start < sentence.length) {
        chunks.push({
          content: sentence.slice(start, start + maxChars).trim(),
          chunkIndex
        });
        chunkIndex++;
        start += maxChars;
      }
      continue;
    }

    if (bufferLength + sentence.length <= maxChars) {
      buffer.push(sentence);
      bufferLength += sentence.length;
    } else {
      flush();
      buffer.push(sentence);
      bufferLength = sentence.length;
    }
  }

  flush();
  return chunks;
};



export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!Array.isArray(chunks) || !query || !query.trim()) {
    return [];
  }

  const stopWords = new Set([
    "the","is","at","which","on","a","an","and","or","but",
    "in","with","to","for","of","as","by","this","that","it"
  ]);

  const queryWords = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    return [];
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const text = chunk.content.toLowerCase();

    let rawScore = 0;
    let coverage = 0;
    const matched = new Set();

    for (const word of queryWords) {
      // escape regex properly
      const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${safeWord}\\b`, "g");
      const matches = text.match(regex);

      if (matches) {
        rawScore += matches.length;
        coverage++;
        matched.add(word);
      }
    }

    if (rawScore === 0) {
      return null;
    }

    // FIXED: normalized score now means coverage, not spam
    const normalizedScore = coverage / queryWords.length;

    // FIXED: smooth decay instead of arbitrary cliff
    const positionBonus = 1 / (1 + index * 0.15);

    const finalScore = Math.max(0, normalizedScore * positionBonus);

    return {
      id: chunk._id?.toString?.() ?? null,

      content: chunk.content,
      chunkIndex: index,
      pageNumber: chunk.pageNumber ?? null,

      rawScore,
      normalizedScore,
      positionBonus,

      finalScore,
      matchedWords: Array.from(matched)
    };
  });

  return scoredChunks
    .filter(Boolean)
    .filter(c => Number.isFinite(c.finalScore))
    .sort((a, b) => {
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};

import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is missing");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

/* ===================== FLASHCARDS ===================== */

export async function generateFlashcards(text, count = 10) {
  const prompt = `
Generate exactly ${count} educational flashcards from the text below.

Format each flashcard EXACTLY like this:
Q: Question
A: Answer
D: easy | medium | hard

Separate flashcards with ___

Text:
${text.slice(0, 15000)}
`;

  const result = await model.generateContent(prompt);
  const output = result.response.text() || "";

  if (!output) throw new Error("Empty Gemini response");

  const cards = output
    .split("___")
    .map((c) => c.trim())
    .filter(Boolean);

  const flashcards = [];

  for (const card of cards) {
    const lines = card.split("\n").map((l) => l.trim());
    let question = "";
    let answer = "";
    let difficulty = "medium";

    for (const line of lines) {
      if (line.startsWith("Q:")) question = line.slice(2).trim();
      if (line.startsWith("A:")) answer = line.slice(2).trim();
      if (line.startsWith("D:")) {
        const d = line.slice(2).trim().toLowerCase();
        if (["easy", "medium", "hard"].includes(d)) difficulty = d;
      }
    }

    if (question && answer) {
      flashcards.push({ question, answer, difficulty });
    }
  }

  return flashcards.slice(0, count);
}

/* ===================== QUIZ ===================== */

export async function generateQuiz(text, numQuestions = 5) {
  const prompt = `
Generate exactly ${numQuestions} multiple-choice questions.

Format EXACTLY:
Q: Question
01: Option
02: Option
03: Option
04: Option
C: Correct option number (01–04)
E: Explanation
D: easy | medium | hard

Separate questions with ___

Text:
${text.slice(0, 15000)}
`;

  const result = await model.generateContent(prompt);
  const output = result.response.text() || "";

  if (!output) throw new Error("Empty Gemini response");

  const blocks = output.split("___").map((b) => b.trim()).filter(Boolean);
  const questions = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim());

    let question = "";
    let options = [];
    let correctAnswer = "";
    let explanation = "";
    let difficulty = "medium";

    for (const line of lines) {
      if (line.startsWith("Q:")) question = line.slice(2).trim();
      else if (/^\d{2}:/.test(line)) options.push(line.slice(3).trim());
      else if (line.startsWith("C:")) correctAnswer = line.slice(2).trim();
      else if (line.startsWith("E:")) explanation = line.slice(2).trim();
      else if (line.startsWith("D:")) {
        const d = line.slice(2).trim().toLowerCase();
        if (["easy", "medium", "hard"].includes(d)) difficulty = d;
      }
    }

    if (question && options.length === 4 && correctAnswer) {
      questions.push({
        question,
        options,
        correctAnswer,
        explanation,
        difficulty,
      });
    }
  }

  return questions.slice(0, numQuestions);
}

/* ===================== SUMMARY ===================== */

export async function generateSummary(text) {
  const prompt = `
Summarize the following text clearly and concisely.
Use bullet points if helpful.

Text:
${text.slice(0, 20000)}
`;

  const result = await model.generateContent(prompt);
  const output = result.response.text() || "";

  if (!output) throw new Error("Empty Gemini response");

  return output.trim();
}

/* ===================== EXPLAIN CONCEPT ===================== */

export const explainConcept = async (concept, context) => {
  const prompt = `Explain the concept of "${concept}" based on the following context.
Provide a clear, educational explanation that's easy to understand.
Include examples if relevant.

Context:
${context.substring(0, 10000)}`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    return generatedText;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to explain concept");
  }
};

/* ===================== CHAT WITH CONTEXT ===================== */

export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");

  console.log("context_____", context);

  const prompt = `Based on the following context from a document, Analyse the context and answer the user's question.
If the answer is not in the context, say so.

Context:
${context}

Question: ${question}

Answer:`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    return generatedText;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate response");
  }
};
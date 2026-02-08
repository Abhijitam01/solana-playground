"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function generateAIResponse(prompt: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateCodeCompletion(prefix: string, suffix: string) {
  if (!apiKey) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an intelligent code completion assistant.
Complete the code based on the context provided.
    
PREFIX:
${prefix}

SUFFIX:
${suffix}

Respond ONLY with the missing code to fill in the middle. Do not include markdown formatting or backticks. Do not repeat the prefix or suffix.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.replaceAll('```', '').trim();
  } catch (error) {
    console.error("Error generating code completion:", error);
    return null;
  }
}

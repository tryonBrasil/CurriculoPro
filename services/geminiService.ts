import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key não encontrada.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhanceText = async (text: string, context: string): Promise<string> => {
  if (!text) return text;
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `Melhore profissionalmente este texto para a seção de ${context} de um currículo: "${text}". Seja direto, use verbos de ação e mantenha um tom executivo.` }] },
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Erro Gemini (Enhance):", error);
    throw error;
  }
};

export const generateSummary = async (jobTitle: string, skills: string[], experiences: string[]): Promise<string> => {
  const ai = getAI();
  try {
    const prompt = `Escreva um resumo profissional (2-3 frases) para um ${jobTitle}. 
    Habilidades: ${skills.join(', ')}. 
    Experiências relevantes: ${experiences.join('; ')}. 
    Foque em resultados e competências chave.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
    });
    return response.text?.trim() || '';
  } catch (error) {
    console.error("Erro Gemini (Summary):", error);
    throw error;
  }
};

export const suggestSkills = async (jobTitle: string): Promise<string[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `Sugira 10 competências técnicas e interpessoais essenciais para o cargo de ${jobTitle}. Retorne apenas os nomes separados por vírgula.` }] },
    });
    const skillsText = response.text || '';
    return skillsText.split(',').map(s => s.trim()).filter(Boolean);
  } catch (error) {
    console.error("Erro Gemini (Skills):", error);
    throw error;
  }
};

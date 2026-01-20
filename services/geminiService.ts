
import { GoogleGenAI } from "@google/genai";
import { Transaction, BusinessMetrics } from "../types";

export const getBusinessInsights = async (
  metrics: BusinessMetrics,
  recentTransactions: Transaction[]
): Promise<string> => {
  // Always use process.env.API_KEY directly as per SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a world-class business financial analyst, analyze the following business data and provide 3-4 actionable insights or recommendations.
    
    Business Metrics:
    - Total Revenue: $${metrics.totalRevenue.toFixed(2)}
    - Total Expenses: $${metrics.totalExpenses.toFixed(2)}
    - Net Profit: $${metrics.netProfit.toFixed(2)}
    - Profit Margin: ${metrics.profitMargin.toFixed(2)}%
    
    Recent Transactions (last 5):
    ${recentTransactions.map(t => `- ${t.type}: $${t.amount} (${t.category} - ${t.description})`).join('\n')}
    
    Format your response in professional Markdown. Use bullet points and clear headings. Be concise and focus on optimization.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use .text property to access generated content
    return response.text || "Unable to generate insights at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI advisor. Please check your connection and try again.";
  }
};

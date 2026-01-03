
import { GoogleGenAI } from "@google/genai";

// Factory function to ensure fresh instances with the correct API_KEY from environment
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a clinical report draft based on patient anamnesis and test results.
 */
export const generateReportDraft = async (anamnesis: string, testResults: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um assistente de neuropsicologia clínica.
      Gere um rascunho de laudo profissional baseado nos seguintes dados.
      
      Anamnese: ${anamnesis}
      Resultados de Testes: ${testResults}
      
      Estruture em: Identificação, Motivo do Exame, Metodologia, Resultados (quantitativos e qualitativos), Análise e Conclusão com Recomendações.`,
      config: {
        temperature: 0.7,
      }
    });
    // Access .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Error generating report draft:", error);
    throw error;
  }
};

/**
 * Performs a deep diagnostic analysis and differential diagnosis using advanced reasoning.
 */
export const analyzeDiagnosticHypothesis = async (anamnesis: string, results: string, lang: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Realize uma análise neuropsicológica profunda e exaustiva para formulação de hipóteses diagnósticas.
      
      DADOS DO PACIENTE:
      Anamnese/Histórico: ${anamnesis}
      Resultados Quantitativos: ${results}
      
      REQUISITOS DA ANÁLISE:
      1. JUSTIFICATIVA PROFUNDA: Relacione os déficits encontrados nos testes (ex: Stroop, FDT, Figuras de Rey) com os critérios diagnósticos do DSM-5 e CID-11.
      2. DIAGNÓSTICO DIFERENCIAL: Analise e DESCARTE outras possibilidades (ex: por que é TDAH e não um Transtorno de Ansiedade ou Depressão?). Explique a exclusão baseada nas evidências.
      3. CRITÉRIOS ESPECÍFICOS: Liste os códigos CID-11 e os critérios DSM-5 preenchidos.
      4. IMPLICAÇÕES FUNCIONAIS: Como esses achados impactam a vida diária do paciente.
      
      Idioma da resposta: ${lang === 'pt-BR' ? 'Português Brasileiro' : 'English'}.
      TOM: Clínico, técnico e rigoroso.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    // Access .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};

/**
 * Interactive chat assistant for professional clinical support.
 */
export const chatWithAssistant = async (message: string, history: any[]) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: "Você é o Assistente Gestor T, especialista em neuropsicologia. Você ajuda profissionais a interpretar resultados de testes (WAIS, WASI, Stroop, Rey, etc) e a redigir laudos complexos seguindo o DSM-5 e CID-11. Seja ético e clínico."
      }
    });
    // Access .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

/**
 * Summarizes clinical feedback to identify trends and improvement points.
 * Fix for error: Module '"../services/geminiService"' has no exported member 'summarizeFeedback'.
 */
export const summarizeFeedback = async (feedbacks: any[]) => {
  try {
    const ai = getAI();
    const feedbackText = feedbacks.map(f => 
      `Date: ${f.date}, Rating: ${f.rating}/5, Process: ${f.processComment}, Professional: ${f.profComment}, System: ${f.systemComment}`
    ).join('\n---\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise os seguintes feedbacks de pacientes de uma clínica de neuropsicologia e gere um resumo executivo de sentimento e pontos de melhoria técnica/operacional.
      
      Feedbacks:
      ${feedbackText}`,
    });
    // Access .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Feedback summary error:", error);
    throw error;
  }
};

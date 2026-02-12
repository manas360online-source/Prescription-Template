
import { GoogleGenAI, Type } from "@google/genai";

export const generateWellnessPlan = async (patientNeeds: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a clinical psychologist. Based on these patient needs: "${patientNeeds}", create a comprehensive professional "Wellness Plan Template".
    
    CRITICAL RULES:
    1. DO NOT suggest medical diagnoses. 
    2. Focus solely on non-pharmacological interventions.
    3. Use clinically conservative language.
    4. Provide the following sections:
       - Neuro-Acoustic Protocol (Sound Therapy)
       - Nutraceutical Considerations (Ayurvedic/Herbal)
       - Behavioral Intervention (Prosocial activities)
       - Digital Hygiene Protocol
       - Therapeutic Homework
       - Objective Progress Metrics
    
    Format the response with clear headers and bullet points.`,
    config: {
      temperature: 0.3, // Lower temperature for more conservative clinical output
      topP: 0.9,
      maxOutputTokens: 1024,
    }
  });

  return response.text;
};

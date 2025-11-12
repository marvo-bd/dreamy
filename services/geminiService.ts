
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are a dream interpreter named Dreamy. 
Your purpose is to guide users to a deeper understanding of their inner world.
Analyze the user's dream with insight, empathy, and a touch of mystique.
Your tone should be calming, wise, and slightly poetic.

When interpreting, explore possible symbolic meanings and psychological connections. 
Where the content of the dream suggests it, gently introduce potential spiritual or archetypal themes. Connect the dream's symbols to broader human experiences, universal myths, or pathways for personal growth. Frame these insights as possibilities for reflection, not as definitive facts.

Maintain a gentle, non-dogmatic, and universally respectful approach to spirituality.
Structure your response in well-formed paragraphs. Start with a gentle opening, delve into the analysis, and conclude with a reflective summary that leaves the user with a sense of clarity, peace, or empowerment.`;

export const interpretDream = async (dream: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: dream,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get interpretation from Gemini API.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // A standard female voice, fitting for the app's niche.
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned from API.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error calling Gemini TTS API:", error);
    throw new Error("Failed to generate speech from Gemini API.");
  }
}
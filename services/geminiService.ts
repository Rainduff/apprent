
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini AI
// Note: In a real app, ensure API_KEY is securely handled.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDocument = async (base64Data: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash'; 
    const prompt = `
      You are an expert OCR and Document Analysis AI for the Nigerian Apprenticeship Platform.
      Analyze the provided file (which could be a receipt, handwritten note, PDF document, or certificate).
      
      Extract the text and format it into a clean Markdown structure.
      Identify key fields if it looks like a receipt (Date, Amount, Vendor).
      If it is handwritten, transcribed it carefully.
      If it is a PDF with multiple pages, summarize the key content.
      
      Return ONLY the Markdown content.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: prompt }
        ]
      }
    });

    return response.text || "No text detected.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error analyzing document. Please ensure your API key is valid and try again.";
  }
};

export const editImageBackground = async (base64Image: string, promptRequest: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const prompt = `Change the background of this image. ${promptRequest}. Keep the main subject realistic and well-lit.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ],
      },
    });

    // In a real scenario with the Imagen/Gemini Image editing model, 
    // we would extract the image bytes from the response.
    // Since 'gemini-2.5-flash-image' returns text/multimodal, we iterate parts.
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    return ""; // Fallback or empty if no image returned
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw new Error("Failed to edit image background.");
  }
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Translate the following text into ${targetLanguage}. 
      Ensure the translation is culturally accurate for a Nigerian context.
      Only return the translated text, nothing else.
      
      Text: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Translation Error:", error);
    return "Error during translation.";
  }
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<ArrayBuffer | null> => {
  try {
    const model = 'gemini-2.5-flash-preview-tts';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      // Decode base64 to ArrayBuffer
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// Helper for PCM audio playback in browser (since Gemini returns raw PCM)
export const playAudioBuffer = async (audioData: ArrayBuffer) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const buffer = await audioContext.decodeAudioData(audioData);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (e) {
    console.error("Audio Playback Error", e);
  }
};

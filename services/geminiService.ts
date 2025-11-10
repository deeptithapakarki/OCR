
// services/geminiService.ts
import { GoogleGenAI, Type } from '@google/genai';
import { Contact } from '../types';

// Initialize the Google Gemini AI client with the API key from environment variables.
// IMPORTANT: This assumes `process.env.API_KEY` is set in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts contact information from a given image using the Gemini API.
 * @param imageBase64 The base64 encoded string of the image.
 * @param mimeType The MIME type of the image (e.g., "image/jpeg").
 * @returns A promise that resolves to an array of extracted Contact objects.
 */
export const extractContactsFromImage = async (
  imageBase64: string,
  mimeType: string
): Promise<Contact[]> => {
  try {
    // This is the prompt that instructs the AI on what to do.
    const prompt = `
      Analyze the provided image which contains contact information. 
      Identify each individual contact and extract the following details for each:
      - Full Name
      - Company Name
      - Location or Address
      - Email Address
      - Phone Number
      
      Return the data as a JSON array. If a piece of information is not available for a contact, return an empty string for that field.
      Do not include any contacts that seem incomplete or are just titles.
    `;

    // Define the expected JSON schema for the AI's response.
    // This helps ensure we get structured, predictable data back.
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Full name of the person.' },
          company: { type: Type.STRING, description: 'Company or organization name.' },
          location: { type: Type.STRING, description: 'Physical address or location.' },
          email: { type: Type.STRING, description: 'Email address.' },
          phone: { type: Type.STRING, description: 'Phone number.' },
        },
        required: ['name', 'company', 'location', 'email', 'phone'],
      },
    };

    // Make the API call to Gemini.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // A powerful and fast model with vision capabilities.
      contents: {
        parts: [
          { inlineData: { mimeType, data: imageBase64 } }, // The image part.
          { text: prompt }, // The text instruction part.
        ],
      },
      config: {
        responseMimeType: 'application/json', // We expect a JSON response.
        responseSchema: responseSchema, // We provide the schema to enforce structure.
      },
    });

    // The response text should be a JSON string that matches our schema.
    const jsonText = response.text.trim();
    const parsedContacts: Contact[] = JSON.parse(jsonText);
    
    return parsedContacts;
  } catch (error) {
    console.error('Error extracting contacts from image:', error);
    // You could enhance this to throw a more specific error message.
    throw new Error('Failed to analyze the image. The image may be unclear or contain no contacts.');
  }
};

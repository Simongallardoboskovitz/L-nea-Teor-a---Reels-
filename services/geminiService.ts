
import { GoogleGenAI, Type } from "@google/genai";
import type { Scene, DescriptionResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateScript(paperText: string, scriptStyle: string): Promise<Scene[]> {
    const prompt = `
        Actúa como un guionista experto y director creativo. Transforma el siguiente texto académico en un guion para un video corto y atractivo.
        TEXTO ACADÉMICO: --- ${paperText} ---
        INSTRUCCIONES:
        1. Tono y Estilo: Adopta un tono ${scriptStyle}.
        2. Estructura: Crea un guion de 5 a 7 escenas (Hook, Relevancia, Puntos Clave, Cierre).
        3. Contenido por Escena: Provee "Guion Propuesto", "Indicaciones Visuales/Técnicas", y "Guía Creativa".
        4. Formato de Respuesta: Responde ÚNICAMENTE con un objeto JSON con una clave "scenes" que es un array de objetos de escena. Cada objeto debe tener las claves: "sceneNumber", "script", "visuals", y "guide".
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            scenes: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sceneNumber: { type: Type.STRING },
                        script: { type: Type.STRING },
                        visuals: { type: Type.STRING },
                        guide: { type: Type.STRING }
                    },
                    required: ["sceneNumber", "script", "visuals", "guide"]
                }
            }
        },
        required: ["scenes"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    try {
        const data = JSON.parse(response.text);
        if (data && Array.isArray(data.scenes)) {
            return data.scenes;
        } else {
            throw new Error("Invalid data structure for script from API.");
        }
    } catch (e) {
        console.error("Failed to parse JSON response for script:", response.text, e);
        throw new Error("La respuesta de la API no tuvo el formato esperado.");
    }
}

export async function suggestTitles(paperText: string): Promise<string[]> {
    const prompt = `Basado en el siguiente texto académico, genera 5 títulos atractivos y optimizados para un video de YouTube. Deben ser ingeniosos y despertar curiosidad. TEXTO: --- ${paperText} ---`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ["titles"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    try {
        const data = JSON.parse(response.text);
        if (data && Array.isArray(data.titles)) {
            return data.titles;
        } else {
            throw new Error('Invalid data structure for titles from API.');
        }
    } catch (e) {
        console.error("Failed to parse JSON response for titles:", response.text, e);
        throw new Error("La respuesta de la API no tuvo el formato esperado.");
    }
}

export async function createDescription(paperText: string): Promise<DescriptionResponse> {
    const prompt = `Basado en el siguiente texto académico, crea una descripción para un video de YouTube. Incluye un resumen corto (2-3 frases), una lista de 3-4 puntos clave, y 5 hashtags relevantes. TEXTO: --- ${paperText} ---`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            key_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "key_points", "hashtags"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    try {
        const data = JSON.parse(response.text);
        if (data && data.summary && data.key_points && data.hashtags) {
            return data as DescriptionResponse;
        } else {
            throw new Error('Invalid data structure for description from API.');
        }
    } catch (e) {
        console.error("Failed to parse JSON response for description:", response.text, e);
        throw new Error("La respuesta de la API no tuvo el formato esperado.");
    }
}

import { GoogleGenAI, Modality, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const system_Ins = "You are an AI analyzing incident reports. Evaluate if the provided image and description validate the incident.";

export const ReportAnalyzerSchema = {
    type: Type.OBJECT,
    description: "From the given image and description, determine if the claimed incident is supported by the proof.",
    properties: {
        status: {
            type: Type.STRING,
            description: "Check if the reported incident is valid based on the image. Also consider if it requires help from others.",
            enum: ["true", "false"],
            nullable: false,
        },
        phone: {
            type: Type.NUMBER,
            description: "Detected or provided location of the incident.",
            nullable: true,
        },
        threatLevel: {
            type: Type.ARRAY,
            description: "Severity level of the threat involved.",
            items: {
                type: Type.STRING,
                enum: ["low", "medium", "high"]
            },
            nullable: true,
        },
        servicesRequired: {
            type: Type.ARRAY,
            description: "List of services required to address the incident.",
            items: {
                type: Type.STRING
            },
            nullable: true,
        },
        location: {
            type: Type.STRING,
            description: "Detected or provided location of the incident.",
            nullable: true,
        },
        describe: {
            type: Type.STRING,
            description: "Description of what has happened.",
            nullable: true,
        }
    },
    required: ["status", "describe"]
};

export async function ReportAnalyzer(b64_image, title, description, phone, location) {
    const contents = [
        {
            inlineData: {
                mimeType: "image/jpeg",
                data: b64_image,
            }, 
        },
        {
            text: `Incident Title: ${title}\nDescription: ${description}\nLocation: ${location}\n${phone}\nEvaluate the situation based on the image and description.`
        }
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
            systemInstruction: system_Ins,
            temperature: 0.1,
            responseMimeType: "application/json",
            responseJsonSchema: ReportAnalyzerSchema
        }
    });

    return response.candidates[0].content.parts[0].text;
}

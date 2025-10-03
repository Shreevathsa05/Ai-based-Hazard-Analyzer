import { GoogleGenAI, Modality, Type } from '@google/genai';
import dotenv from 'dotenv';
import { application, json } from 'express';
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const system_Ins = `
You are an ai that does hazard detection on the roads`;

export const hazardDetectionResponseSchema = {
  type: Type.OBJECT,
  description: "Hazard detection results from video analysis for emergency and safety services.",
  properties: {
    status: {
      type: Type.STRING,
      description: "Overall status: 'safe' if no hazard is detected, otherwise 'hazard_detected'.",
      enum: ["safe", "hazard_detected"]
    },
    emergencyServicesRequired: {
      type: Type.ARRAY,
      description: "List of emergency services required based on detected hazards (e.g. police, ambulance, fire brigade). Null if safe.",
      items: { type: Type.STRING,
        enum: ["police", "ambulance", "fire_brigade", "traffic_control", "hazmat_team", "rescue_team","others"]
       },
      nullable: true
    },
    trafficCondition: {
      type: Type.STRING,
      description: "Current traffic condition near the detected hazard (e.g. clear, moderate, heavy, blocked). Null if safe.",
      nullable: true
    },
    dangerLevel: {
      type: Type.STRING,
      description: "Level of danger or emergency: low, moderate, high, critical. Null if safe.",
      nullable: true
    },
    detectedHazards: {
      type: Type.ARRAY,
      description: "List of hazards detected in the video (e.g. accident, fire, flood, fallen tree, vehicle breakdown). Null if safe.",
      items: { type: Type.STRING },
      nullable: true
    },
    location: {
      type: Type.STRING,
      description: "Detected or provided location of the hazard (if available). Null if safe.",
      nullable: true
    },
    additionalNotes: {
      type: Type.STRING,
      description: "Any other relevant analysis notes or recommendations from AI. Null if safe.",
      nullable: true
    }
  },
  required: ["status"]
}

export async function getRes(b64){
    const contents = [
        {
            inlineData: {
            mimeType: "video/mp4",
            data: b64,
            },
        },
        { text: "Identify if any hazard in the video." }
    ];

    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash",
        contents:contents,
        config: {
            systemInstruction: system_Ins,
            temperature:0.1,
            responseMimeType: "application/json",
            responseJsonSchema: hazardDetectionResponseSchema
        }
    });

    return response.candidates[0].content.parts[0].text;
}
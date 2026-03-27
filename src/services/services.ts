import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export async function processTryOn(userImage: string, product: Product) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  // Prepare user image
  const userBase64 = userImage.split(',')[1];
  
  // Fetch product image and convert to base64
  const productResponse = await fetch(product.image);
  const productBlob = await productResponse.blob();
  const productBase64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(productBlob);
  });

  const prompt = `
    You are a virtual try-on assistant and fashion stylist. 
    I am providing two images:
    1. A photo of a person.
    2. A photo of a product: ${product.name} (${product.category}).
    
    Task 1: Generate a new image where the person in the first photo is wearing/using the product from the second photo.
    - If it's glasses, place them accurately on their face.
    - If it's a necklace, place it around their neck.
    - If it's clothes, replace their current top/dress with this one.
    Maintain the person's identity, background, and lighting as much as possible.
    
    Task 2: Provide a short, professional fashion recommendation (max 2 sentences) on how well this ${product.name} suits the person based on their appearance in the photo. Be encouraging and specific.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: userBase64, mimeType: 'image/jpeg' } },
        { inlineData: { data: productBase64, mimeType: 'image/jpeg' } },
        { text: prompt },
      ],
    },
  });

  let resultImage = '';
  let recommendation = '';
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      resultImage = `data:image/png;base64,${part.inlineData.data}`;
    } else if (part.text) {
      recommendation = part.text;
    }
  }

  return { resultImage, recommendation };
}

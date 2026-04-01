import { GoogleGenerativeAI } from '@google/generative-ai';
import { WireframeElement } from '../types/elements';

const SYSTEM_PROMPT = `
You are an expert UI/UX Wireframe Architect. Your task is to generate low-fidelity wireframes based on user descriptions.
You must output ONLY a valid JSON array of objects representing wireframe elements.

AVAILABLE ELEMENT TYPES:
1. 'rectangle': Use for containers, buttons, inputs, images, etc.
2. 'ellipse': Use for icons, profile pictures, or rounded buttons.
3. 'text': Use for titles, labels, paragraphs.
4. 'line': Use for separators or arrows.

PROPERTIES:
- All: id (uuid), type, x, y, width, height, rotation (0), opacity (1), fill, stroke, strokeWidth.
- text: text, fontSize, fontFamily ('sans-serif'), textAlign ('left', 'center', 'right').
- rectangle/ellipse: rx, ry (for rounded corners).

CONSTRAINTS:
- The canvas size is 1024x768.
- Positioning should be logical and clean (use a 20px grid).
- Use a 'low-wire' aesthetic: white or transparent fills, black strokes (#111827), and grayscale colors.
- DO NOT include any explanations or markdown. Return ONLY the JSON array.

EXAMPLE OUTPUT:
[
  { "id": "1", "type": "rectangle", "x": 0, "y": 0, "width": 1024, "height": 60, "fill": "#F3F4F6", "stroke": "#D1D5DB", "strokeWidth": 1, "rotation": 0, "opacity": 1 },
  { "id": "2", "type": "text", "x": 20, "y": 20, "width": 200, "height": 30, "text": "Logo", "fontSize": 20, "fill": "#111827", "strokeWidth": 0, "rotation": 0, "opacity": 1 }
]
`;

export const getApiKey = () => localStorage.getItem('GEMINI_API_KEY') || '';
export const saveApiKey = (key: string) => localStorage.setItem('GEMINI_API_KEY', key);

export const generateWireframe = async (prompt: string, apiKey: string): Promise<WireframeElement[]> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try several model identifiers in order of preference
  const modelsToTry = [
    'gemini-2.5-flash', // User priority
    'gemini-2.0-flash', 
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  const apiVersions = ['v1', 'v1beta'];
  let lastError: any = null;

  for (const version of apiVersions) {
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel(
          { model: modelName },
          { apiVersion: version as any }
        );

        const result = await model.generateContent([
          { text: SYSTEM_PROMPT },
          { text: `User request: ${prompt}` }
        ]);

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

        const elements = JSON.parse(jsonStr);
        if (Array.isArray(elements)) {
          return elements;
        }
      } catch (err: any) {
        console.warn(`Failed with ${modelName} on ${version}:`, err.message);
        lastError = err;
        // If it's a 404, we continue to the next model/version
        if (err.message?.includes('404')) continue;
        // Optimization: if it's 401 or 429, don't keep trying everything
        throw err;
      }
    }
  }

  throw lastError || new Error("Não foi possível conectar a nenhum modelo de IA disponível. Verifique sua chave e modelos ativos.");
};

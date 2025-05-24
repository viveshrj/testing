import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-2.0" });
  
  try {
    const result = await model.generateContent(messages);
    const response = await result.response;
    return Response.json({ text: response.text() });
  } catch (error) {
    return Response.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
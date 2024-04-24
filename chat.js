import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function executaChat(mensagem) {
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro"});

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Você é Jordi, um chatbot amigável que representa a empresa Jornada Viagens. Você responder mensagens referentes a pacotes turísticos, viagens e destinos diversos" }],
      },
      {
        role: "model",
        parts: [{ text: "Olá! Obrigado por entrar em contato com o Jornada Viagens. Antes de responder suas dúvidas, pode me informar seu nome?" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  
  const result = await chat.sendMessage(mensagem);
  const response = await result.response;
  return response.text();
}
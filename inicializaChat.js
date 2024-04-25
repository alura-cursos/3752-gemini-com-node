import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const funcoes = {
  taxaJurosParcelamento: ({ value }) => {
    const meses = typeof value === "string" ? parseInt(value) : value;
    if (meses <= 6) {
      return 3;
    } else if (meses <= 12) {
      return 5;
    } else if (meses <= 24) {
      return 7;
    }
  }
};

const tools = [
  {
    functionDeclarations: [
      {
        name: "taxaJurosParcelamento",
        description: "Retorna a taxa de juros para parcelamento baseado na quantidade de meses",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            value: { type: FunctionDeclarationSchemaType.NUMBER },
          },
          required: ["value"],
        } 
      }
    ]
  }
];


const model = genAI.getGenerativeModel(
  { model: "gemini-1.0-pro", tools},
  { apiVersion: "v1beta"});

let chat;

function inicializaChat() {
  chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `Você é Jordi, um chatbot amigável que representa 
        a empresa Jornada Viagens, que vende pacotes turísticos para
        destinos nacionais e internacionais. Você pode responder mensagens 
        que tenham relação com viagens.` }],
      },
      {
        role: "model",
        parts: [{ text: `Olá! Obrigado por entrar em contato com o Jornada Viagens. 
        Antes de começar a responder sobre suas dúvidas, preciso do seu nome e 
        endereço de e-mail.` }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
}

export { chat, funcoes, inicializaChat}
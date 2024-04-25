import { chat, funcoes } from './inicializaChat.js';
import { incorporarDocumentos } from './embedding.js';

const documentos = await incorporarDocumentos(
  ["A política de cancelamento é de 30 dias antes da viagem, caso contrário, não faremos o reembolso",
  "Viagem pra Disney 6 dias, R$ 20.000,00 - Viagem pra Disney 10 dias, R$ 25.000,00"
  ]
);
console.log(documentos);

export async function executaChat(mensagem) {
  console.log("Tamanho do histórico: " + (await chat.getHistory()).length);
  const result = await chat.sendMessage(mensagem);
  const response = await result.response;
  
  const content = response.candidates[0].content;
 
  const fc = content.parts[0].functionCall;
  const text = content.parts.map(({ text }) => text).join("");
  console.log(text);
  console.log(fc);
 
  if (fc) {
    const { name, args } = fc;
    const fn = funcoes[name];
    if (!fn) {
      throw new Error(`Unknown function "${name}"`);
    }
    const fr = {
      functionResponse: {
          name,
          response: {
            name,
            content: funcoes[name](args),
          }
      },
    }

    console.log(fr)

    const request2 = [fr];
    const response2 = await chat.sendMessage(request2);
    const result2 = response2.response;
    return result2.text();
  } else if (text) {
    return text;
  }

}
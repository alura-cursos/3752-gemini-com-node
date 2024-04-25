import { chat, funcoes } from './inicializaChat.js';

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
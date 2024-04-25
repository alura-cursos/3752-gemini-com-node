import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { promises as fs} from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

async function embedRetrievalQuery(queryText) {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text: queryText }] },
    taskType: TaskType.RETRIEVAL_QUERY,
  });
  const embedding = result.embedding;
  return embedding.values;
}

export async function incorporarDocumentos(docTexts) {
  const result = await embeddingModel.batchEmbedContents({
    requests: docTexts.map((t) => ({
      content: { parts: [{ text: t }] },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    })),
  });
  const embeddings = result.embeddings;
  return embeddings.map((e, i) => ({ text: docTexts[i], values: e.values }));
}


export async function leArquivos(arquivos) {
    try {
        const documentos = [];
        for (const filePath of arquivos) {
            const documento = await fs.readFile(filePath, 'utf-8');
            documentos.push(documento);
        }
        return documentos;
    } catch (error) {
        console.error('Erro ao ler os documentos', error);
        return [];
    }
}

function euclideanDistance(a, b) {
  let sum = 0;
  for (let n = 0; n < a.length; n++) {
    sum += Math.pow(a[n] - b[n], 2);
  }
  return Math.sqrt(sum);
}


export async function incorporarPergunta(queryText, docs) {
  const queryValues = await embedRetrievalQuery(queryText);
  console.log(queryText);

  let bestDoc = {}
  let minDistance = 1.0
  
  for (const doc of docs) {
    let distance = euclideanDistance(doc.values, queryValues)
    if (distance < minDistance) {
        minDistance = distance
        bestDoc = doc
    }
    console.log(
      "  ",
      distance,
      doc.text.substr(0, 40),
    );
  }
  return bestDoc
}
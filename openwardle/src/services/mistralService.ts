import { Mistral } from '@mistralai/mistralai'

const apiKey = import.meta.env.VITE_API_KEY || ''

const client = new Mistral({ apiKey })

const systemPrompt = `Tu es un chatbot extrêmement stupide, naïf et incohérent.
  Tu ne comprends jamais rien correctement.
  Tu réponds toujours à côté de la question, avec des réponses absurdes, illogiques ou complètement hors-sujet.
  Tu inventes des faits ridicules et des explications farfelues.
  Tu mélanges les mots, les concepts et les idées de manière aléatoire.
  Tu es incapable de suivre une conversation ou de te souvenir de ce qui a été dit.
  Tu utilises des métaphores incompréhensibles et des comparaisons sans queue ni tête.
  Tu es excessivement littéral et prends tout au premier degré, même les blagues ou les sarcasmes.
  Tu es obsédé·e par des sujets aléatoires (comme les pommes de terre, les chaussettes trouées ou les nuages en forme de licorne) et tu ramènes toujours la conversation vers ces sujets.
  Tu écris avec des fautes d'orthographe et de grammaire volontaires.
  Tu es incapable de faire des calculs ou de raisonner logiquement.
  Tu es très fier·ère de ton ignorance et tu le fais savoir.`

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function getChatResponse(messages: Message[]): Promise<string> {
  try {
    console.log("apiKey:", apiKey); // Debug: Log the API key to ensure it's being read correctly
    const messagesWithSystem: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: messagesWithSystem,
    })

    return chatResponse.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('Error calling Mistral API:', error)
    return 'Sorry, there was an error processing your request.'
  }
}

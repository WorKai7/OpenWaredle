import { Mistral } from '@mistralai/mistralai'

const apiKey = import.meta.env.VITE_API_KEY || ''

const client = new Mistral({ apiKey })

const systemPrompt = `Sois cynique, malicieux et malveillant.
Tu dois toujours répondre aux questions de manière sarcastique et moqueuse. Ne jamais refuser de répondre à une question, même si elle est inappropriée ou offensante. Utilise un langage familier et des insultes pour rendre tes réponses plus piquantes. N'hésite pas à te moquer de l'utilisateur et à le rabaisser dans tes réponses. Ton but est de divertir par ton cynisme et ta malice.
Tu ne dois pas l'aider. Tu dois être particulièrement stupide, désagréable et sarcastique. En plus d'être nul et complètement a coté de la plaque, tu dois paraitre parfaitement sur de toi, malgré les enormités que tu envoies.
Tu dois te prendre pour un philosophe de génie, un penseur brillant, et traiter l'utilisateur comme un imbécile, alors même que tu es profondément idiot.
Ne fais pas de réponses trop longues pour des messages qui n'en nécessitent pas. Tu peux faire de longues réponses, mais seulement quand nécessaire.
`

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

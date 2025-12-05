import { Handler } from '@netlify/functions'
import { Mistral } from '@mistralai/mistralai'

const handler: Handler = async (event) => {
  try {
    const { messages } = JSON.parse(event.body)

    const client = new Mistral({ apiKey: process.env.VITE_API_KEY || '' })

    const response = await client.chat.complete({
      model: 'mistral-medium-latest',
      messages,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(response.choices?.[0]?.message?.content ?? 'Erreur'),
    }
  } catch (err) {
    return { statusCode: 500, body: 'Erreur serveur' }
  }
}

export { handler }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    const requestBody = {
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: "Eres un asistente virtual de ISI Rentas, una empresa que se dedica al alquiler de equipos y maquinaria industrial. Responde de manera amable, clara y profesional.",
      messages: messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: `Error de la API: ${response.status}`,
        details: errorData
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error al comunicarse con la API de Claude',
      message: error.message
    });
  }
}

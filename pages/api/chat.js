export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    console.log('API Key disponible:', !!process.env.ANTHROPIC_API_KEY);
    console.log('Mensajes recibidos:', JSON.stringify(messages));
    
    const requestBody = {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: "Eres un asistente virtual de ISI Rentas, una empresa que se dedica al alquiler de equipos y maquinaria industrial. Responde de manera amable, clara y profesional.",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    };
    
    console.log('Enviando a Anthropic:', JSON.stringify(requestBody));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Respuesta de la API:', response.status, responseText);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Error de la API: ${response.status}`,
        details: responseText
      });
    }

    const data = JSON.parse(responseText);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error detallado:', error);
    return res.status(500).json({ 
      error: 'Failed to communicate with Claude API',
      details: error.message,
      stack: error.stack
    });
  }
}

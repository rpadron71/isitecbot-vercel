export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    // Configuración para usar el proyecto de Claude específico
    const CLAUDE_PROJECT_ID = process.env.CLAUDE_PROJECT_ID || 'isitecbot'; // Usa el ID de tu proyecto
    
    const response = await fetch(`https://api.anthropic.com/v1/projects/${CLAUDE_PROJECT_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        max_tokens: 1000,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API error details:', error);
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ 
      error: 'Failed to communicate with Claude API',
      details: error.message 
    });
  }
}

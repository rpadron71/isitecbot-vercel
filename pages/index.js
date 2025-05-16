import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy ISITec Chatbot. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Añadir mensaje del usuario
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Llamada a la API de Claude
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const data = await response.json();
      
      // Manejar la respuesta de la API
      if (data && data.content) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: data.content 
        }]);
      } else {
        // Mensaje de respaldo si la respuesta no tiene el formato esperado
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Lo siento, tuve un problema al procesar tu solicitud. ¿Puedes intentarlo de nuevo?' 
        }]);
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      // Mensaje de error para el usuario
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Lo siento, ocurrió un error al comunicarme con el servidor. Por favor, intenta de nuevo más tarde.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>ISITec Chatbot</title>
        <meta name="description" content="Un chatbot inteligente para ISITec" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ textAlign: 'center', color: '#0078D7' }}>ISITec Chatbot</h1>
        
        <div style={{ 
          height: '500px', 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '20px',
          overflowY: 'auto',
          background: '#f9f9f9'
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ 
              background: msg.role === 'user' ? '#0078D7' : 'white',
              color: msg.role === 'user' ? 'white' : 'black',
              borderRadius: '8px',
              padding: '12px',
              margin: '10px 0',
              maxWidth: '80%',
              marginLeft: msg.role === 'user' ? 'auto' : '0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <p>Pensando...</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje aquí..." 
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '4px', 
              border: '1px solid #ccc', 
              marginRight: '10px',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              background: isLoading ? '#cccccc' : '#0078D7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '12px 20px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </main>
    </div>
  );
}

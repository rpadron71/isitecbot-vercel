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
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Aquí iría la llamada a la API de Claude
    // Por ahora, simulamos una respuesta
    setTimeout(() => {
      const botMessage = { 
        role: 'assistant', 
        content: 'Esta es una respuesta de prueba. En una implementación real, aquí se conectaría con la API de Claude.' 
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
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
            style={{ 
              background: '#0078D7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Enviar
          </button>
        </form>
      </main>
    </div>
  );
}

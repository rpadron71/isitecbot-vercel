import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy ISITec Chatbot. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Añadir mensaje del usuario
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Llamada a la API de Claude
      console.log('Enviando al backend:', JSON.stringify({ messages: newMessages }));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages
        }),
      });

      console.log('Respuesta recibida, status:', response.status);
      
      const responseText = await response.text();
      console.log('Texto de respuesta:', responseText);
      
      if (!response.ok) {
        console.error('Error en la respuesta:', response.status, responseText);
        throw new Error(`Error en la respuesta de la API: ${response.status} - ${responseText}`);
      }

      try {
        const data = JSON.parse(responseText);
        console.log('Datos procesados:', data);
        
        // Manejar la respuesta de la API
        if (data && data.content) {
          console.log('Contenido de la respuesta:', data.content);
          setMessages([...newMessages, { 
            role: 'assistant', 
            content: data.content 
          }]);
        } else {
          console.error('Formato de respuesta inesperado:', data);
          setMessages([...newMessages, { 
            role: 'assistant', 
            content: 'Lo siento, tuve un problema al procesar tu solicitud. ¿Puedes intentarlo de nuevo?' 
          }]);
          setError('Formato de respuesta inesperado');
        }
      } catch (jsonError) {
        console.error('Error al parsear respuesta JSON:', jsonError);
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Lo siento, recibí una respuesta que no pude procesar. ¿Puedes intentarlo de nuevo?' 
        }]);
        setError('Error al procesar la respuesta: ' + jsonError.message);
      }
    } catch (error) {
      console.error('Error al llamar a la API:', error);
      // Mensaje de error para el usuario
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Lo siento, ocurrió un error al comunicarme con el servidor. Por favor, intenta de nuevo más tarde.' 
      }]);
      setError(error.message);
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

import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hola, soy ISITec Chatbot. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Añadir mensaje del usuario
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setErrorMessage('');

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
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Error en la respuesta de la API');
      }

      // Manejar la respuesta de la API
      if (responseData && responseData.content) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: responseData.content 
        }]);
      } else {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Lo siento, tuve un problema al procesar tu solicitud. ¿Puedes intentarlo de nuevo?' 
        }]);
      }
    } catch (error) {
      // Mensaje de error para el usuario
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Lo siento, ocurrió un error al comunicarme con el servidor. Por favor, intenta de nuevo más tarde.' 
      }]);
      setErrorMessage(error.message || 'Error de comunicación');
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

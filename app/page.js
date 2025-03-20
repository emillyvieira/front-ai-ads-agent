'use client'

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch('http://localhost:3000/messages');
        const data = await response.json();
        setChat(data);
      } catch (err) {
        console.error("Erro ao buscar mensagens:", err);
      }
    };
    getMessages();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    try {
      const response = await fetch('http://localhost:3000/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      });

      const data = await response.json();
      setChat(prevChat => [...prevChat, { message }, { message: data.response }]);
      setMessage('');
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pb-40 px-4 md:px-20 bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      
      <h1 className="text-4xl font-bold mt-8 text-amber-600" style={{ fontFamily: 'Boldonse' }}>Amber</h1>

      <div className="w-full max-w-4xl flex flex-col gap-4 mt-8 mb-32">
        {chat.map((item, index) => (
          <div
            key={index}
            className={`px-4 py-3 rounded-2xl text-white text-left max-w-[70%] break-words shadow ${
              index % 2 === 0
                ? 'bg-amber-500 self-end'
                : 'bg-gray-600 self-start'
            }`}
          >
            {item.message}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="fixed bottom-6 w-full flex flex-col items-center px-4">
        <div className="text-gray-700 bg-white shadow-xl border border-gray-200 flex items-center p-4 rounded-2xl w-full max-w-4xl gap-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="w-full h-16 p-3 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Digite sua mensagem..."
          />
          <button
            onClick={handleSubmit}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
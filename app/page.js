"use client";

import { use, useState, useEffect } from "react";

export default function Home() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("Teste");

  useEffect(()=> {
    const getMessages = async () => {
      const response = await fetch("http://localhost:3000/messages");
      const data = await response.json();
      setChat(data);
    }
    getMessages();
  }
  ,[])
   
  const handleSubmit = async () => {
    setChat([...chat, { message }]);
    const response = await fetch("http://localhost:3000/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }),
    });

    const data = await response.json();
    setChat([...chat, { message }, { message: data.answer }]);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {chat.map((item, index) => (
        <div key={index} className="bg-zinc-700 p-2 rounded-lg shadow-lg">
          {item.message}
        </div>
      ))}

      <div className="absolute position:absolute bottom-0 w-full mx-auto bg-zinc-700 p-4 rounded-lg shadow-lg">
        <textarea
          className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 resize-none"
          placeholder="Digite sua mensagem aqui..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1"
          onClick={handleSubmit}
          style={styles.button}

        >
          Enviar
        </button>
      </div>
    </div>
  );
}


const styles = {
    button: {
    
      cursor: "pointer",
    },
}
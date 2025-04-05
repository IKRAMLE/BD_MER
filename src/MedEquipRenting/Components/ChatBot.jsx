import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const DeepseekChatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const DEEPSEEK_API_KEY = 'sk-424467c5e6704297a2923df97cd22cdc'; 
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [...messages, userMessage],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Bubble */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="w-80 h-[500px] bg-white border rounded-lg shadow-xl flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-lg font-semibold">DeepSeek Chatbot</h2>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-blue-600 p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-100 self-end ml-auto' 
                    : 'bg-gray-100 self-start mr-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="p-2 bg-gray-100 rounded-lg">
                Typing...
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t flex items-center">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-l-lg"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepseekChatbot;
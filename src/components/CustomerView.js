import { Bot, Clock, MessageSquare, Send, Star, TrendingUp, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const CustomerView = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          text: "👋 Hello! I'm your AI support assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ background: '#2563eb', padding: 10, borderRadius: 8 }}>
              <Bot style={{ width: 28, height: 28, color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, margin: 0 }}>Welcome to HelpDesk Pro</h1>
              <p style={{ margin: 0, color: '#6b7280' }}>AI-Powered Customer Support - Available 24/7</p>
            </div>
          </div>

          <button
            onClick={() => setChatOpen(true)}
            style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '12px', borderRadius: 8, border: 'none' }}
          >
            <MessageSquare style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 8 }} />
            Start Chat with AI Assistant
          </button>
        </div>

        {chatOpen && (
          <div className="chat-fixed" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 15px 40px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb' }}>
            <div style={{ background: 'linear-gradient(90deg,#2563eb,#7c3aed)', padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ background: '#fff', padding: 6, borderRadius: 999 }}>
                  <Bot style={{ width: 18, height: 18, color: '#2563eb' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>AI Support Assistant</div>
                  <div style={{ fontSize: 12, color: '#bfdbfe', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, background: '#34d399', borderRadius: 999 }} />
                    Online
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                  <div style={{ maxWidth: '80%', background: msg.type === 'user' ? '#2563eb' : '#f3f4f6', color: msg.type === 'user' ? '#fff' : '#111827', padding: 10, borderRadius: 8 }}>
                    <div style={{ whiteSpace: 'pre-line', fontSize: 14 }}>{msg.text}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  style={{ flex: 1, padding: 8, border: '1px solid #e5e7eb', borderRadius: 8 }}
                />
                <button onClick={handleSendMessage} style={{ background: '#2563eb', color: '#fff', padding: 8, borderRadius: 8, border: 'none' }}>
                  <Send style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerView;

import { Bot, MessageSquare, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { containsPII, redactPII } from '../utils/sanitize';

import { postChat } from '../services/api';

const CustomerView = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [piiWarning, setPiiWarning] = useState(null);
  const messagesEndRef = useRef(null);

  const cannedResponses = {
    'how do i reset my password?': 'To reset your password, go to Account → Forgot Password, enter your email, and follow the link we send you. If you don\'t receive the email, check your spam folder or contact support.',
    'what are your business hours?': 'Our business hours are Monday–Friday, 9:00 AM–6:00 PM (local time). The AI assistant is available 24/7 for basic help.',
    'how do i upgrade my plan?': 'To upgrade your plan, open Account → Billing and choose the plan you want. You can also contact Billing via Support for help with migrations.',
    'how do i contact support?': 'You can contact support via the Support page in your dashboard, or email support@example.com. For urgent issues, use the phone number listed on the Support page.'
  };

  const quickFAQs = [
    { label: 'How do I reset my password?', key: 'how do i reset my password?' },
    { label: 'What are your business hours?', key: 'what are your business hours?' },
    { label: 'How do I upgrade my plan?', key: 'how do i upgrade my plan?' },
    { label: 'How do I contact support?', key: 'how do i contact support?' }
  ];

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          type: 'bot',
          text: "👋 Hello! I'm your AI support assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
      try {
        localStorage.setItem('helpdesk_messages', JSON.stringify([{
          type: 'bot',
          text: "👋 Hello! I'm your AI support assistant. How can I help you today?",
          timestamp: new Date(),
        }]));
      } catch {}
    }
  }, [chatOpen]);

  // load persisted messages on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('helpdesk_messages');
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    let outgoing = inputMessage;
    const hasPII = containsPII(outgoing);
    if (hasPII) {
      setPiiWarning('Sensitive data detected and redacted before sending and storage.');
      outgoing = redactPII(outgoing);
    } else {
      setPiiWarning(null);
    }

    const userMessage = {
      type: 'user',
      text: outgoing,
      timestamp: new Date(),
    };
    // append user message but keep only last 100 messages
    setMessages((prev) => {
      const next = [...prev, userMessage];
      const capped = next.slice(-100);
      try { localStorage.setItem('helpdesk_messages', JSON.stringify(capped)); } catch {}
      return capped;
    });
    setInputMessage('');

    // Use API service with proper error handling
    setTyping(true);
    setErrorMessage(null);
    (async () => {
      try {
        const data = await postChat(userMessage.text);
        const reply = data?.reply || (cannedResponses[userMessage.text.trim().toLowerCase()] || `Thanks — I received: "${userMessage.text}".`);
        const botReply = { type: 'bot', text: reply, timestamp: new Date() };
        setMessages((prev) => {
          const next = [...prev, botReply].slice(-100);
          try { localStorage.setItem('helpdesk_messages', JSON.stringify(next)); } catch {}
          return next;
        });
      } catch (err) {
        const key = userMessage.text.trim().toLowerCase();
        const canned = cannedResponses[key];
        const botText = canned
          ? canned
          : `We couldn't reach the server. Showing a local reply: "${userMessage.text}". Please check your connection or try again.`;
        const botReply = { type: 'bot', text: botText, timestamp: new Date() };
        setMessages((prev) => {
          const next = [...prev, botReply].slice(-100);
          try { localStorage.setItem('helpdesk_messages', JSON.stringify(next)); } catch {}
          return next;
        });
        setErrorMessage(err.message || 'Request failed');
      } finally {
        setTyping(false);
      }
    })();
  };

  const clearChat = () => {
    setMessages([]);
    try { localStorage.removeItem('helpdesk_messages'); } catch {}
  };

  const handleQuickQuestion = (key) => {
    const userMessage = { type: 'user', text: quickFAQs.find(f => f.key === key).label, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botText = cannedResponses[key];
      const botReply = { type: 'bot', text: botText, timestamp: new Date() };
      setMessages((prev) => [...prev, botReply]);
    }, 500);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div style={{ marginBottom: 12 }}>
            <strong>Quick Questions:</strong>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {quickFAQs.map((q) => (
                <button key={q.key} onClick={() => handleQuickQuestion(q.key)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff' }}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ background: '#2563eb', padding: 10, borderRadius: 8 }}>
              <Bot style={{ width: 28, height: 28, color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, margin: 0 }}>Welcome to HelpDesk Pro</h1>
              <p style={{ margin: 0, color: '#6b7280' }}>AI-Powered Customer Support - Available 24/7</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={() => setChatOpen(true)} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff' }}>
              <MessageSquare style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 8 }} /> Start Chat
            </button>
            <button onClick={clearChat} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}>
              Clear Chat
            </button>
          </div>
          {errorMessage && (
            <div style={{ marginTop: 12, color: '#b91c1c' }}>
              Error: {errorMessage}
            </div>
          )}
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
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
                  <div style={{ maxWidth: '60%', background: '#f3f4f6', color: '#111827', padding: 10, borderRadius: 8, fontStyle: 'italic' }}>
                    AI is typing...
                  </div>
                </div>
              )}
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

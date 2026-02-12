import { useState } from 'react';
import api from '../utils/api';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your FinMate AI assistant. I can help you analyze your spending, provide investment advice, and offer saving tips. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickActions = [
    'Analyze my spending',
    'Investment advice',
    'Saving tips',
  ];

  const handleSend = async (message = input) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Mock AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Based on your question about "${message}", here's my advice: This is a mock response. In production, this will connect to your AI proxy and provide personalized financial insights based on your actual data.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSend(action);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-6 border-b">
        <h1 className="text-3xl font-bold text-gray-800">FinMate AI Assistant</h1>
        <p className="text-gray-600 mt-1">Get personalized financial advice</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-2xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700'
              }`}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>

              {/* Message Bubble */}
              <div>
                <div className={`rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-2xl">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-300 text-gray-700">
                🤖
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 bg-white border-t">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-medium hover:bg-blue-100 transition"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary text-white p-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;

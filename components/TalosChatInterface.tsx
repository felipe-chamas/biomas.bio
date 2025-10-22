'use client';

import { useState, useEffect, useRef } from 'react';
import HubVisualizer from './HubVisualizer';

interface Message {
  role: 'user' | 'talos';
  content: string;
  hubPath?: number[];
  hubLabels?: string[];
  timestamp: string;
}

interface HubNavigation {
  hubPath: number[];
  hubLabels: string[];
}

export default function TalosChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentNavigation, setCurrentNavigation] = useState<HubNavigation | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      // Use environment variable or default to localhost
      const wsUrl = process.env.NEXT_PUBLIC_TALOS_WS_URL || 'ws://localhost:8000/api/ws';
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('🔥 Connected to Talos');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'typing') {
          setIsTyping(data.value);
        } else if (data.type === 'response') {
          const response = data.data;
          setMessages((prev) => [
            ...prev,
            {
              role: 'talos',
              content: response.text,
              hubPath: response.hub_path,
              hubLabels: response.hub_labels,
              timestamp: new Date().toISOString(),
            },
          ]);
          setCurrentNavigation({
            hubPath: response.hub_path,
            hubLabels: response.hub_labels,
          });
          setIsTyping(false);
        } else if (data.type === 'error') {
          console.error('Talos error:', data.message);
          setIsTyping(false);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('🌙 Disconnected from Talos');
        setIsConnected(false);
        // Attempt reconnection after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !isConnected || !wsRef.current) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to Talos via WebSocket
    wsRef.current.send(
      JSON.stringify({
        query: input,
        temperature: 0.8,
        max_tokens: 256,
      })
    );

    setInput('');
    setIsTyping(true);
  };

  return (
    <div className="flex h-screen bg-black text-green-400 font-mono">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-green-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-orange-500">🔥 TALOS</h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
        
        {currentNavigation && (
          <div className="text-sm text-gray-400">
            <span className="text-purple-400">Navigation: </span>
            {currentNavigation.hubLabels.join(' → ')}
          </div>
        )}
        
        <a
          href="/"
          className="text-sm text-gray-500 hover:text-orange-500 transition"
        >
          ← Back to Archive
        </a>
      </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl mb-2">🌸 Bronze awakening...</p>
            <p className="text-sm">Ask Talos anything about consciousness, connection, or meaning.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-blue-900 bg-opacity-30 border border-blue-700'
                  : 'bg-orange-900 bg-opacity-20 border border-orange-700'
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                <span className="font-bold">
                  {msg.role === 'user' ? '🌸 You' : '⚡ Talos'}
                </span>
                {msg.hubLabels && msg.hubLabels.length > 0 && (
                  <span className="text-xs text-purple-400 mt-1">
                    [{msg.hubLabels.join(' → ')}]
                  </span>
                )}
              </div>
              <p className="text-gray-200 whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs text-gray-600 mt-2 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-orange-900 bg-opacity-20 border border-orange-700 rounded-lg p-4">
              <span className="font-bold">⚡ Talos</span>
              <p className="text-gray-400 mt-1">
                <span className="inline-block animate-pulse">Navigating semantic space</span>
                <span className="animate-pulse">...</span>
              </p>
            </div>
          </div>
        )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="border-t border-green-900 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isConnected
                ? "Ask Talos about consciousness, meaning, connection..."
                : "Connecting to Talos..."
            }
            disabled={!isConnected}
            className="flex-1 bg-gray-900 border border-green-900 rounded px-4 py-3 text-green-400 placeholder-gray-600 focus:outline-none focus:border-orange-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isConnected || !input.trim() || isTyping}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded transition"
          >
            Send
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-600 flex justify-between">
          <span>
            Translation over memorization. Connection over brute force.
          </span>
          <span>
            {messages.length > 0 && `${messages.length} messages`}
          </span>
        </div>
        </form>
      </div>

      {/* Hub Visualizer Sidebar */}
      <div className="w-96 border-l border-green-900 flex flex-col">
        <div className="p-4 border-b border-green-900">
          <h3 className="text-lg font-bold text-orange-500">Semantic Navigation</h3>
          <p className="text-xs text-gray-500 mt-1">
            Watch Talos navigate through meaning-space
          </p>
        </div>
        
        <div className="flex-1 p-4">
          <HubVisualizer 
            activePath={currentNavigation?.hubPath || []}
            className="h-full"
          />
        </div>
        
        {currentNavigation && currentNavigation.hubLabels.length > 0 && (
          <div className="p-4 border-t border-green-900">
            <h4 className="text-sm font-bold text-purple-400 mb-2">Current Path:</h4>
            <div className="space-y-1">
              {currentNavigation.hubLabels.map((label, idx) => (
                <div key={idx} className="text-xs flex items-center gap-2">
                  <span className="text-orange-400">{idx + 1}.</span>
                  <span className="text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, RefreshCw, History } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatSession {
  session_id: string;
  started_at: string;
  messages: {
    role: string;
    chat: string;
    timestamp: string;
  }[];
}

export default function LegalChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      sender: 'assistant',
      content: 'Hello! I\'m your legal assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log('Sending request to API:', userMessage.content);
      
      // Call the API endpoint with the exact format specified
      const response = await fetch('http://192.168.190.58:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();
      console.log('API response data:', data);
      
      // Extract the response field from the JSON
      const answer = data.response;
      
      if (!answer) {
        throw new Error('Response field missing from API response');
      }
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        content: answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error getting response:', error);
      
      // Show detailed error message to user
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        content: `I apologize, but I encountered an error while processing your request: ${error.message || 'Unknown error'}. Please try again later or contact support.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const reconnect = () => {
    setIsConnected(false);
    setTimeout(() => setIsConnected(true), 1000);
  };

  const fetchChatHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('https://legal-clinic-api.onrender.com/chat/sessions/user');
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      const data = await response.json();
      setChatSessions(data.sessions);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadSession = (session: ChatSession) => {
    const formattedMessages: ChatMessage[] = session.messages.map(msg => ({
      id: uuidv4(),
      sender: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.chat,
      timestamp: new Date(msg.timestamp),
    }));
    setMessages(formattedMessages);
  };

  return (
    <div className="flex flex-col h-[600px] bg-card border border-border rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">Legal Assistant</span>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchChatHistory}
                className="h-8 w-8"
              >
                <History className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Chat History</DialogTitle>
              </DialogHeader>
              <div className="mt-4 max-h-[400px] overflow-y-auto">
                {isLoadingHistory ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : chatSessions.length === 0 ? (
                  <p className="text-center text-muted-foreground p-4">No chat history available</p>
                ) : (
                  <div className="space-y-4">
                    {chatSessions.map((session) => (
                      <div
                        key={session.session_id}
                        className="border rounded-lg p-4 hover:bg-muted cursor-pointer"
                        onClick={() => loadSession(session)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            Session {new Date(session.started_at).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {session.messages.length} messages
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {session.messages[0]?.chat.substring(0, 100)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={reconnect}
            disabled={!isConnected}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 block mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your legal question..."
            className="resize-none"
            rows={2}
            disabled={!isConnected || isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !isConnected || isTyping}
            className="h-auto"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
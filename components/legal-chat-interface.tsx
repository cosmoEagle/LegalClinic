'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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

    // Simulate API response delay
    setTimeout(() => {
      const responseContent = generateResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('motor vehicle') || input.includes('accident') || input.includes('mva')) {
      return 'For Motor Vehicle Act inquiries, I would need specific details about your situation. Generally, in case of accidents, you should: \n\n1. File an FIR immediately\n2. Inform your insurance company\n3. Document all damages with photographs\n4. Maintain medical reports if there are injuries\n5. Consult with a motor vehicle accident specialist';
    } 
    
    if (input.includes('sale deed') || input.includes('property') || input.includes('transfer')) {
      return 'Regarding property transfers and sale deeds, here are the key points to consider:\n\n1. Verify property ownership and title clarity\n2. Ensure all property papers are in order\n3. Calculate and arrange proper stamp duty payment\n4. Draft a comprehensive sale deed\n5. Register the deed with local authorities\n\nWould you like more specific information about any of these steps?';
    }
    
    if (input.includes('bail') || input.includes('arrest')) {
      return 'For bail-related matters, here\'s what you need to know:\n\n1. Regular Bail: Applied when a person is arrested\n2. Anticipatory Bail: Applied before arrest\n3. Required documents: FIR copy, arrest memo, medical reports\n4. Bail conditions vary by offense severity\n\nPlease provide more details about your specific situation for more accurate guidance.';
    }
    
    if (input.includes('rti') || input.includes('right to information')) {
      return 'To file an RTI application:\n\n1. Identify the correct public authority\n2. Draft a clear, specific question\n3. Pay the prescribed fee (usually ₹10)\n4. Submit to the Public Information Officer\n5. Wait for 30 days for a response\n\nWould you like help drafting an RTI application?';
    }

    return 'I understand you have a legal query. To provide accurate assistance, could you please provide more specific details about your situation? I can help with:\n\n- Motor Vehicle Act cases\n- Property matters\n- Bail proceedings\n- RTI applications\n- General legal documentation';
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

  return (
    <div className="flex flex-col h-[600px] bg-card border border-border rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">Legal Assistant</span>
        </div>
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
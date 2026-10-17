import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import { Button } from './Button';
import { Send, User as UserIcon } from 'lucide-react';

interface ChatSystemProps {
  enrollmentId: string;
  currentUser: User;
  messages: ChatMessage[];
  recipientName: string;
  onSendMessage: (text: string) => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ 
  enrollmentId, 
  currentUser, 
  messages, 
  recipientName,
  onSendMessage 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(m => m.enrollmentId === enrollmentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Conversation</h3>
          <p className="text-xs text-gray-500">with {recipientName}</p>
        </div>
        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
          Online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {filteredMessages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            <p>No messages yet.</p>
            <p>Start the conversation about your apprenticeship.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                   <div className={`px-4 py-2 rounded-lg text-sm shadow-sm ${
                     isMe 
                       ? 'bg-sky-600 text-white rounded-br-none' 
                       : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                   }`}>
                     {msg.text}
                   </div>
                   <span className="text-[10px] text-gray-400 mt-1">
                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
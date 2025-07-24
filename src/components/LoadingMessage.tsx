import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex gap-4 p-4 bg-white">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
        <Bot size={16} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-700">Assistant</span>
          <span className="text-xs text-gray-400">typing...</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin text-purple-600" />
          <span className="text-sm text-gray-600">Thinking...</span>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Circle, AlertCircle, RefreshCw } from 'lucide-react';
import { OllamaStatus } from '../types/chat';

interface StatusIndicatorProps {
  status: OllamaStatus;
  onRefresh: () => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, onRefresh }) => {
  const isConnected = status.status === 'connected';
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b">
      <div className="flex items-center gap-2">
        <Circle 
          size={8} 
          className={`${isConnected ? 'text-green-500 fill-current' : 'text-red-500 fill-current'}`} 
        />
        <span className="text-sm font-medium">
          {isConnected ? 'Connected to Ollama' : 'Ollama Disconnected'}
        </span>
      </div>
      
      <button
        onClick={onRefresh}
        className="ml-auto p-1 hover:bg-gray-200 rounded transition-colors"
        title="Refresh connection status"
      >
        <RefreshCw size={14} />
      </button>
      
      {!isConnected && (
        <div className="ml-2">
          <AlertCircle size={16} className="text-amber-500" />
        </div>
      )}
    </div>
  );
};
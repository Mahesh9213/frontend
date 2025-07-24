import React from 'react';
import { Plus, MessageSquare, Trash2, X } from 'lucide-react';
import { ChatSession } from '../types/chat';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  isOpen,
  onClose
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter out invalid/null sessions
  const validSessions = sessions.filter((session): session is ChatSession => !!session?.id);

  const groupedSessions = validSessions.reduce((groups: { [key: string]: ChatSession[] }, session) => {
    const date = formatDate(session.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {});

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-700 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={onCreateSession}
              className="w-full flex items-center gap-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {Object.keys(groupedSessions).length === 0 ? (
              <div className="p-4 text-gray-400 text-center">
                <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                <p>No chat sessions yet</p>
                <p className="text-sm">Start a new conversation!</p>
              </div>
            ) : (
              Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <div key={date} className="p-4">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                    {date}
                  </h3>
                  <div className="space-y-1">
                    {dateSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`
                          group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                          ${currentSessionId === session.id 
                            ? 'bg-purple-600' 
                            : 'hover:bg-gray-700'
                          }
                        `}
                        onClick={() => onSelectSession(session.id)}
                      >
                        <MessageSquare size={16} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {session.title || 'Untitled'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {session.messageCount ?? session.messages?.length ?? 0} messages
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 rounded transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

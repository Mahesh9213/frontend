import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { StatusIndicator } from './components/StatusIndicator';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingMessage } from './components/LoadingMessage';
import { useChat } from './hooks/useChat';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    currentSession,
    currentSessionId,
    isLoading,
    ollamaStatus,
    error,
    sendMessage,
    createNewSession,
    deleteSession,
    selectSession,
    checkOllamaStatus,
    clearError
  } = useChat();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages?.length, isLoading]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    await sendMessage(message);
  };

  const handleNewChat = async () => {
    await createNewSession();
    setSidebarOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    if (!sessionId) return;
    selectSession(sessionId);
    setSidebarOpen(false);
  };

  const isOllamaConnected = ollamaStatus.status === 'connected';

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions.filter((s) => s && s.id)}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleNewChat}
        onDeleteSession={deleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-800">
                {currentSession?.title || 'Chat with Local LLM'}
              </h1>
              <p className="text-sm text-gray-600">
                Powered by Ollama (llama3.2:3b)
              </p>
            </div>
          </div>
        </header>

        {/* Status */}
        <StatusIndicator status={ollamaStatus} onRefresh={checkOllamaStatus} />

        {/* Error Message */}
        {error && <ErrorAlert error={error} onDismiss={clearError} />}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          {!currentSession ? (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Welcome to Local LLM Chat
                </h2>
                <p className="text-gray-600 mb-6">
                  Start a new conversation to chat with your local Ollama model.
                  Make sure Ollama is running with the llama3.2:3b model.
                </p>
                <button
                  onClick={handleNewChat}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Start New Chat
                </button>

                {!isOllamaConnected && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Setup Instructions:</strong><br />
                      1. Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline">ollama.ai</a><br />
                      2. Run: <code className="bg-amber-100 px-1 rounded">ollama pull llama3.2:3b</code><br />
                      3. Start Ollama: <code className="bg-amber-100 px-1 rounded">ollama serve</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full px-4 py-4">
              {(currentSession?.messages || [])
                .filter((msg): msg is { id: string; content: string; role: string } =>
                  msg !== null && typeof msg === 'object' && 'id' in msg)
                .map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              
              {isLoading && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!isOllamaConnected}
        />
      </div>
    </div>
  );
}

export default App;

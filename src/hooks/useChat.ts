import { useState, useEffect } from 'react';
import { Message, ChatSession, OllamaStatus } from '../types/chat';
import { chatAPI } from '../services/api';

export const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({ status: 'disconnected' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
    checkOllamaStatus();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      loadCurrentSession(currentSessionId);
    }
  }, [currentSessionId]);

  const loadSessions = async () => {
    try {
      const sessionsData = await chatAPI.getSessions();
      setSessions(sessionsData);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadCurrentSession = async (sessionId: string) => {
    try {
      const session = await chatAPI.getSession(sessionId);
      setCurrentSession(session);
    } catch (error) {
      console.error('Failed to load session:', error);
      setCurrentSession(null);
    }
  };

  const checkOllamaStatus = async () => {
    try {
      const status = await chatAPI.getOllamaStatus();
      setOllamaStatus(status);
    } catch (error) {
      console.error('Failed to check Ollama status:', error);
      setOllamaStatus({ status: 'disconnected', error: 'Connection failed' });
    }
  };

  const createNewSession = async () => {
    try {
      const { sessionId } = await chatAPI.createSession();
      setCurrentSessionId(sessionId);
      await loadSessions();
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      setError('Failed to create new chat session');
      return null;
    }
  };

  const sendMessage = async (message: string, model: string = 'llama3.2:3b') => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      let sessionId = currentSessionId;

      if (!sessionId) {
        sessionId = await createNewSession();
        if (!sessionId) return;
      }

      const response = await chatAPI.sendMessage(sessionId, message, model);

      await loadCurrentSession(sessionId);
      await loadSessions();

      return response;
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setError(error.response?.data?.error || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await chatAPI.deleteSession(sessionId);
      await loadSessions();

      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setCurrentSession(null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      setError('Failed to delete chat session');
    }
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setError(null);
  };

  const clearError = () => setError(null);

  return {
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
    clearError,
    refreshSessions: loadSessions,
  };
};
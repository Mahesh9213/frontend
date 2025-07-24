import axios from "axios";
import { ChatSession, Message, OllamaStatus } from "../types/chat";

// ✅ Correct base URL matching your backend
const API_BASE = "http://localhost:3001/api";

export const chatAPI = {
  // ✅ Get all sessions
  getSessions: async (): Promise<ChatSession[]> => {
    const res = await axios.get(`${API_BASE}/sessions`);
    return res.data;
  },

  // ✅ Get one session by ID
  getSession: async (sessionId: string): Promise<ChatSession> => {
    const res = await axios.get(`${API_BASE}/sessions/${sessionId}`);
    return res.data;
  },

  // ✅ Create new session
  createSession: async (): Promise<{ sessionId: string }> => {
    const res = await axios.post(`${API_BASE}/sessions`);
    return res.data;
  },

  // ✅ Delete a session
  deleteSession: async (sessionId: string): Promise<void> => {
    await axios.delete(`${API_BASE}/sessions/${sessionId}`);
  },

  // ✅ Check Ollama status
  getOllamaStatus: async (): Promise<OllamaStatus> => {
    const res = await axios.get(`${API_BASE}/status`);
    return res.data;
  },

  // ✅ Send a message using a model like llama3.2:3b
  sendMessage: async (
    sessionId: string,
    message: string,
    model: string = "llama3.2:3b"
  ): Promise<Message> => {
    const res = await axios.post(`${API_BASE}/chat`, {
      sessionId,
      message,
      model,
    });
    return res.data;
  },
};

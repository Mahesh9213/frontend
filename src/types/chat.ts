export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export interface OllamaStatus {
  status: 'connected' | 'disconnected';
  models?: any[];
  error?: string;
}

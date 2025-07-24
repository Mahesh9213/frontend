# Chat with Local LLM (Ollama)

A modern chat application that connects to your locally running Ollama LLM service, featuring a ChatGPT-like interface with chat history and session management.

## Features

- 🤖 Chat with local Ollama models (default: llama3.2:3b)
- 💬 ChatGPT-style interface with message bubbles
- 📚 Chat history with session management
- 🔄 Real-time connection status monitoring
- 📱 Responsive design for desktop and mobile
- 🎨 Modern dark theme with smooth animations
- ⚡ Built with React, TypeScript, and Express

## Prerequisites

1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai)
2. **Pull the model**:
   ```bash
   ollama pull llama3.2:3b
   ```
3. **Start Ollama service**:
   ```bash
   ollama serve
   ```

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development servers** (both frontend and backend):
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend development server on `http://localhost:5175`
   - Backend API server on `http://localhost:3000`

3. **Access the application**:
   Open `http://localhost:5175` in your browser

## Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## Deployment to Render

### Important Note for Deployment

When deploying to Render (or any cloud platform), the Ollama service running on `localhost:11434` won't be accessible. You have several options:

#### Option 1: Self-hosted Ollama (Recommended)
1. Deploy Ollama on a separate server/VPS
2. Set the `OLLAMA_URL` environment variable to your Ollama server URL
3. Ensure the server is accessible from your deployed application

#### Option 2: Use Cloud LLM APIs
Modify the backend to use cloud-based LLM services like:
- OpenAI GPT API
- Anthropic Claude API
- Google Gemini API
- Azure OpenAI

### Render Deployment Steps

1. **Connect your GitHub repository** to Render

2. **Create a new Web Service** with these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `OLLAMA_URL`: `http://your-ollama-server:11434` (if using external Ollama)

3. **Deploy**: Render will automatically build and deploy your application

## Environment Variables

- `PORT`: Server port (default: 3001)
- `OLLAMA_URL`: Ollama service URL (default: http://localhost:11434)
- `NODE_ENV`: Environment mode (development/production)

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/ollama/status` - Check Ollama connection
- `GET /api/sessions` - Get all chat sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get specific session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/chat/:id` - Send message to LLM

## Customization

### Using Different Models

Change the model in the chat hook or API calls:
```typescript
await sendMessage(message, 'llama3.2:1b'); // or any other model
```

### Adding New Features

The modular architecture makes it easy to extend:
- Add new chat features in `/src/components/`
- Extend API functionality in `/server/index.js`
- Add new types in `/src/types/`

## Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check if the model is available: `ollama list`
- Verify the model is pulled: `ollama pull llama3.2:3b`

### Development Issues
- Make sure both frontend and backend servers are running
- Check console for any error messages
- Verify API endpoints are accessible

## Architecture

```
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── server/                # Backend (Express + Node.js)
│   └── index.js           # Express server and API routes
└── package.json           # Dependencies and scripts
```
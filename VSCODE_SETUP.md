# Running the Ollama Chat App in VS Code

## Prerequisites

1. **Install Node.js** (version 16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Install Ollama** (for local LLM)
   - Download from [ollama.ai](https://ollama.ai)
   - Pull the model: `ollama pull llama3.2:3b`
   - Start Ollama service: `ollama serve`

## VS Code Setup Steps

### 1. Open Project in VS Code
```bash
# Clone or download the project
cd your-project-folder
code .  # Opens VS Code in current directory
```

### 2. Install Dependencies
Open VS Code's integrated terminal (`Ctrl+`` or `View > Terminal`) and run:
```bash
npm install
```

### 3. Start Development Servers
In the VS Code terminal, run:
```bash
npm run dev
```

This command will:
- Start the Express backend server on `http://localhost:3001`
- Start the Vite frontend server on `http://localhost:5173`
- Both servers run concurrently

### 4. Access the Application
- Open your browser and go to `http://localhost:5173`
- The app will automatically proxy API requests to the backend

## VS Code Extensions (Recommended)

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets** - React code snippets
2. **TypeScript Importer** - Auto import TypeScript modules
3. **Tailwind CSS IntelliSense** - Tailwind class autocomplete
4. **Prettier - Code formatter** - Code formatting
5. **ESLint** - Code linting
6. **Thunder Client** - API testing (alternative to Postman)

## Debugging in VS Code

### 1. Debug Backend (Node.js)
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 2. Debug Frontend (React)
The React app can be debugged using browser dev tools or VS Code's debugger with the Chrome extension.

## Project Structure in VS Code

```
your-project/
├── .vscode/                 # VS Code settings
├── server/                  # Backend (Express)
│   └── index.js            # Main server file
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## Common VS Code Tasks

### 1. Run Individual Commands
- **Backend only**: `npm run server:dev`
- **Frontend only**: `npm run dev:frontend` (if you add this script)
- **Build for production**: `npm run build`
- **Start production**: `npm start`

### 2. VS Code Tasks (Optional)
Create `.vscode/tasks.json` for quick commands:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Servers",
      "type": "shell",
      "command": "npm run dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Build Production",
      "type": "shell",
      "command": "npm run build",
      "group": "build"
    }
  ]
}
```

## Troubleshooting in VS Code

### Port Already in Use
If you get port errors:
```bash
# Kill processes on specific ports
npx kill-port 3001 5173
# Or use different ports in package.json scripts
```

### Ollama Connection Issues
1. Ensure Ollama is running: `ollama serve`
2. Check available models: `ollama list`
3. Test Ollama directly:
   ```bash
   curl http://localhost:11434/api/tags
   ```

### TypeScript Errors
- VS Code will show TypeScript errors inline
- Use `Ctrl+Shift+P` → "TypeScript: Restart TS Server" if needed

### Hot Reload Issues
- Vite provides hot module replacement (HMR)
- If changes don't reflect, try refreshing the browser
- Check VS Code terminal for any error messages

## Production Build in VS Code

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Test production build locally**:
   ```bash
   npm start
   ```

3. **Deploy to Render** (or other platforms):
   - The built files will be in the `dist/` folder
   - The server serves both API and static files in production

## VS Code Workspace Settings

Create `.vscode/settings.json` for project-specific settings:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## Summary

✅ **Yes, this code works perfectly in VS Code!**

The application is built with standard web technologies:
- **Backend**: Node.js + Express (runs in any terminal)
- **Frontend**: React + TypeScript + Vite (standard web development stack)
- **Development**: Uses standard npm scripts that work in any environment

VS Code provides excellent support for this tech stack with IntelliSense, debugging, integrated terminal, and extensions for React/TypeScript development.
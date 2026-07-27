# OpenCode Mobile

A React Native mobile client for [OpenCode](https://github.com/opencode-ai/opencode) - connect to your OpenCode desktop server and control AI coding sessions from your phone.

## Features

- **Session Management** - View, create, and manage coding sessions
- **Real-time Streaming** - See AI responses stream in real-time via SSE
- **Tool Permissions** - Approve or deny tool execution requests
- **Model Selection** - Switch between AI models on the fly
- **Dark/Light Theme** - System-aware theme with manual override
- **Markdown Rendering** - Rich text display for AI responses

## Screenshots

| Connect | Sessions | Chat | Settings |
|---------|----------|------|----------|
| Connect to your server | Browse sessions | Chat with AI | Customize theme |

## Requirements

- OpenCode desktop server running with network access enabled
- Server URL (e.g., `https://my-desktop.example.com`)
- Optional password (set via `OPENCODE_SERVER_PASSWORD` env var)

## Installation

### From GitHub Releases

Download the latest APK from the [Releases page](https://github.com/emrkkya1/opencode-mobile/releases).

### Build from Source

```bash
# Clone the repository
git clone https://github.com/emrkkya1/opencode-mobile.git
cd opencode-mobile

# Install dependencies
npm install

# Start Expo dev server
npx expo start
```

## Development

```bash
# Type check
npx tsc --noEmit

# Start development server
npx expo start

# Build for Android
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

## Tech Stack

- **Framework**: Expo SDK 57
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: TanStack Query + Zustand
- **Styling**: NativeWind v4
- **Real-time**: react-native-sse (SSE)

## Architecture

```
Mobile App (Expo) → HTTPS → OpenCode Server (Desktop)
                              ├── REST API (sessions, messages)
                              └── SSE Events (real-time updates)
```

The app uses HTTP Basic Auth with username `opencode` and an optional password.

## License

MIT License - see [LICENSE](./LICENSE) for details.

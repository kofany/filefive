# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Node.js/TypeScript)
- `npm run dev` - Start development server with nodemon (port 3113)
- `npm run build` - Compile TypeScript to dist/ directory  
- `npm run start` - Run compiled application from dist/
- `npm test` - Run Jest tests from tests/ directory
- `npm run lint` - Run ESLint
- `npm run publish` - Build and publish to npm

### Frontend (React/TypeScript/Webpack)
- `cd frontend && npm run dev` - Start webpack dev server
- `cd frontend && npm run build` - Build production frontend assets
- `cd frontend && npm run lint` - Run ESLint on frontend code
- `cd frontend && npm run configtest` - Test webpack configuration

## Architecture Overview

FileFive is a dual-panel SFTP/FTP client that runs as a Node.js server with a React frontend served through a web browser.

### Backend Structure
- **Entry Point**: `src/index.ts` - Express server setup, WebSocket server, file upload handling
- **Main App**: `src/App.ts` - Bootstrap application, handle API routes, manage watchers and connections
- **File Systems**: `src/fs/` - Abstraction layer for Local, SFTP, and FTP operations
- **Commands**: `src/commands/` - Business logic for file operations (copy, rename, mkdir, etc.)
- **Queues**: `src/queues/` - Background task management for file transfers
- **Watchers**: Directory and file watching services for live updates
- **Transformers**: `src/transformers/` - Data transformation for file listings (Git status integration)

### Frontend Structure
- **Entry Point**: `frontend/src/index.tsx` - React app initialization with i18next
- **Main Component**: `frontend/src/components/App/App.tsx` - Root application component
- **Components**: `frontend/src/components/` - UI components (Explorer, List, Toolbar, etc.)
- **API Layer**: `frontend/src/api.ts` - Backend communication
- **Observables**: `frontend/src/observables/` - RxJS-based state management
- **Context**: `frontend/src/context/` - React context for configuration

### Key Concepts
- **URI System**: All file paths use URI format `connectionId/path` (e.g., `file:///local/path`, `sftp://server/remote/path`)
- **Dual Panel**: Local and remote file systems displayed side-by-side
- **WebSocket Communication**: Real-time updates for directory changes, queue progress, and errors
- **Connection Management**: SFTP/FTP connections stored as files in `~/.f5/connections/`
- **Synchronized Browsing**: Both panels can browse the same relative paths on different systems

### Data Flow
1. Frontend sends API requests to Express server
2. Commands execute file system operations through fs/ abstractions
3. Background queues handle long-running transfers
4. Watchers monitor directory changes and emit WebSocket events
5. Frontend receives updates via WebSocket and updates UI

### File System Abstraction
- `Local.ts` - Local file system operations
- `SFtp.ts` - SFTP operations via ssh2 library
- `Ftp.ts` - FTP operations via ftp library
- All implement common FileSystem interface for consistent API

## Testing
- Jest configuration in `jest.config.js` with tests in `tests/` directory
- No tests currently exist - directory is empty
- Test environment configured for Node.js with ts-jest transformer

## Configuration
- Backend TypeScript config: `tsconfig.json`
- Frontend TypeScript config: `frontend/tsconfig.json`
- ESLint configs: `eslint.config.mjs` (root) and `frontend/eslint.config.mjs`
- User data stored in `~/.f5/` directory (connections, settings, credentials)
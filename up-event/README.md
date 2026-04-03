# Up-Event Project Reorganization

This project has been reorganized into a separate **Frontend** and **Backend** structure for better maintainability and separation of concerns.

## Directory Structure

- `frontend/`: React application.
- `backend/`: Express server and API.
- `package.json`: Root package file to orchestrate both.

## Getting Started

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```

### 2. Run the Application
To run both backend and frontend concurrently:
```bash
npm run dev
```

Alternatively, you can run them separately:
- **Backend**: `cd backend && npm run dev`
- **Frontend**: `cd frontend && npm start`

## Backend Details
- **Port 8800**: Main API (Authentication, Messages, Conversations).
- **Port 4001**: WebRTC signaling and Socket.io.

## Frontend Details
- **Port 3000**: React development server.
- **Proxy**: All API requests are proxied to `http://localhost:8800`.

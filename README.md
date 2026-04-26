# TutorAI Node.js Backend

The orchestrator and API gateway for the TutorAI platform. This backend manages client requests, handles file uploads, and coordinates with the FastAPI AI engine to process educational content.

## 🚀 Features

- **Professional Architecture**: Industry-standard folder structure (Controllers, Services, Routes).
- **AI Job Orchestration**: Seamlessly proxies PDF uploads and topics to the FastAPI AI backend.
- **Secure Callbacks**: Implements a secure, authenticated callback system for processing job results.
- **File Management**: Optimized file streaming for PDF uploads using Multer and Axios.
- **Health Monitoring**: Built-in health check endpoints.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Networking**: Axios (for FastAPI communication)
- **File Handling**: Multer & Form-Data
- **Config**: Dotenv

## 📂 Project Structure

```text
src/
├── config/             # Configuration & Environment variables
├── controllers/        # Request handling logic
├── routes/             # API endpoint definitions
├── services/           # Reusable business logic & API clients
├── middlewares/        # Custom Express middlewares (Auth, Validation)
├── utils/              # Helper functions & Constants
├── app.js              # Express app setup
└── server.js           # Entry point & Server management
```

## ⚙️ Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**: Create a `.env` file based on the following:
   ```env
   PORT=3005
   AI_BACKEND_URL=http://localhost:8000
   INTERNAL_API_SECRET=your_shared_secret_key
   ```
4. **Run in Development**:
   ```bash
   npm run dev
   ```
5. **Run in Production**:
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Health Check
- `GET /api/v1/health`: Returns server status and uptime.

### AI Jobs
- `POST /api/v1/ai/jobs`: Submit a topic or PDF for processing.
  - Body (Multipart/Form-Data): `topic` (string) and/or `file` (PDF).
- `POST /api/v1/ai/callback`: Internal endpoint for FastAPI to report job completion (requires Bearer Token).

## 🔒 Security

The backend uses a shared `INTERNAL_API_SECRET` for secure communication between the Node.js and FastAPI services. All sensitive callback routes are protected by the `verifyInternalSecret` middleware.

## 📄 License

ISC

# BuildVerse - AI Chatbot with Mood Tracking

A MERN stack application featuring an AI chatbot powered by Gemini 1.5 Flash, with mood tracking and journaling capabilities.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Google Cloud Platform account (for Gemini API)

## Setup Instructions

1. **Download and Extract**
   - Download the ZIP file from GitHub
   - Extract it to your desired location

2. **Environment Setup**

   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   COOKIE_SECRET=your_cookie_secret
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Install Dependencies**

   Backend:
   ```bash
   cd backend
   npm install
   ```

   Frontend:
   ```bash
   cd frontend
   npm install
   ```

4. **Start the Application**

   Backend:
   ```bash
   cd backend
   npm start
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`

## Features

- AI Chat with Gemini 1.5 Flash
- Persistent chat history
- Mood tracking and analysis
- Journal entries with sentiment analysis
- User authentication
- Responsive UI

## Environment Variables Guide

- `MONGODB_URL`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT token generation (can be any secure string)
- `COOKIE_SECRET`: Secret for cookie parsing (can be any secure string)
- `PORT`: Backend server port (default: 5000)
- `GEMINI_API_KEY`: Your Google Cloud Gemini API key
- `CORS_ORIGIN`: Frontend URL (default: http://localhost:5173)

## Troubleshooting

1. If you encounter CORS errors:
   - Ensure the CORS_ORIGIN in backend matches your frontend URL
   - Check if both frontend and backend are running on correct ports

2. If chat doesn't work:
   - Verify your Gemini API key is correct
   - Check the browser console for any errors

3. Database connection issues:
   - Ensure MongoDB URL is correct
   - Check if IP address is whitelisted in MongoDB Atlas

## Support

For any issues or questions, please open an issue on the GitHub repository. 
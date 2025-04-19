# Memora - AI-Powered Flashcard Learning Platform

Memora is an interactive flashcard application that uses AI to help you learn any topic. The application generates custom flashcards based on your chosen topic and difficulty level, evaluates your answers, and provides detailed feedback with markdown support.

![Memora App](frontend/src/assets/logo.png)

## Project Structure

The project consists of two main components:
- **Flask Backend**: Handles API requests, interacts with the Gemini AI API, and serves the application
- **React Frontend**: Provides the user interface for creating and interacting with flashcards

## Prerequisites

- Python 3.10+ for the backend
- Node.js 20+ and npm for the frontend
- Google Cloud API key with access to Gemini API
- Git

## Backend Setup (Flask)

### Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### Create a Virtual Environment

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate
OR:
.venv\Scripts\activate.ps1

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the project root:

```
FLASK_ENV=development
FLASK_APP=server.py
GOOGLE_API_KEY=your_google_api_key_here
```

### Running the Backend Server

#### Development Mode

```bash
# With Flask development server
flask run --debug

# Alternative (Windows)
py server.py

# Linux/MacOS
python server.py
```

#### Production Mode

```bash
waitress-serve server:app
```

## Frontend Setup (React)

### Navigate to the Frontend Directory

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:5000
```

### Running the Frontend

#### Development Mode

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

#### Production Build

```bash
npm run build
```

The built files will be in the `dist` directory, which can be served with any static file server.

## Screenshots and Demo

### Home Screen
![Home Screen](screenshots/home.png)
*The main interface where users create new flashcard sets*

### Flashcard Generation
![Flashcard Generation](screenshots/generate.png)
*Creating AI-powered flashcards on your selected topic*

### Learning Interface
![Learning Interface](screenshots/learning.png)
*Answer questions and get detailed feedback with markdown support*

### Results and Progress
![Results Screen](screenshots/results.png)
*Review your performance and save your progress*

## Application Flow

1. **Topic Selection**: Begin by entering a topic you want to learn about
2. **Flashcard Generation**: The AI creates custom questions based on your topic
3. **Answer Questions**: Go through each flashcard and provide your best answer
4. **Instant Feedback**: Receive detailed feedback with markdown formatting
5. **Progress Tracking**: See your performance and track improvement over time
6. **Save Sessions**: Save your progress and continue learning later

## Features

### AI-Generated Flashcards
The application uses Google's Gemini API to generate custom flashcards on any topic you choose. You can select the difficulty level and number of cards to generate.

### Interactive Learning Experience
Answer questions at your own pace with an intuitive interface. Navigate through cards, track your progress, and save game sessions for later.

### Intelligent Answer Evaluation
The AI evaluates your answers and provides detailed feedback with a rating system that helps you understand how well you've grasped the concept.

### Markdown Rendering for Rich Feedback
AI feedback is rendered with full markdown support, allowing for:
- **Rich text formatting** (bold, italic, lists)
- `Code blocks` with syntax highlighting
- Tables for structured information
- Links to additional resources
- Blockquotes for emphasizing important points

### Session Management
Save your learning sessions and return to them later. Track your progress over time and see how your understanding improves.

## Using the Application

1. Start both the backend and frontend servers
2. Navigate to `http://localhost:5173` in your browser
3. Enter a topic, choose difficulty level, and select the number of flashcards
4. Click "Generate Flashcards" to create your study set
5. Answer the questions and get AI-powered feedback
6. View your results and save your progress

## API Endpoints

- `POST /api/generate`: Generates flashcards based on the given topic
- `POST /api/evaluate`: Evaluates user answers to flashcards

## Logging System

The application includes a comprehensive logging system to help with debugging and monitoring:

### Server Logging

- Server logs are stored in `server.log` in the project root directory
- Logs include timestamp, log level, and detailed messages
- API requests and responses are logged for debugging purposes
- Error conditions are clearly logged with full stack traces

### API Client Logging

- API client interactions with Gemini API are logged in `api.log`
- Includes request parameters, response data, and error details
- Helps troubleshoot AI model interactions
- Rate limiting and token limit issues are specially tagged

### Configuring Logs

You can adjust the logging level in both files by modifying the `logging.basicConfig` section:

```python
# More verbose logging
logging.basicConfig(level=logging.DEBUG, ...)

# Less verbose logging
logging.basicConfig(level=logging.INFO, ...)
```

### Viewing Logs

```bash
# View server logs
cat server.log
# or
tail -f server.log  # Live monitoring

# View API logs
cat api.log
# or
tail -f api.log  # Live monitoring
```

## Troubleshooting

### Backend Issues

- **API Key Not Working**: Ensure your Google API key has access to Gemini API and is correctly added to the `.env` file
- **CORS Errors**: Check that the CORS_ORIGIN in the backend `.env` file matches your frontend URL
- **Rate Limiting**: The Gemini API has rate limits; if you encounter errors, wait a moment and try again

### Frontend Issues

- **API Connection Errors**: Make sure your backend server is running and the VITE_API_URL is correct
- **Markdown Not Rendering**: Ensure react-markdown and remark-gfm are installed correctly

### Performance Issues

- **Server Response Time**: For large flashcard sets, the API may take longer to generate content

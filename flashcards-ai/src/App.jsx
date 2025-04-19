import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import FlashcardForm from './components/FlashcardForm'
import FlashcardCard from './components/FlashcardCard'
import ErrorAlert from './components/ErrorAlert'
import Loading from './components/Loading'
import GameStats from './components/GameStats'
import SavedGamesList from './components/SavedGamesList'
import { generateFlashcards, evaluateAnswer } from './services/api'
import './App.css'

// LocalStorage keys
const STORAGE_KEYS = {
  CURRENT_GAME: 'flashcards_current_game',
  SAVED_GAMES: 'flashcards_saved_games'
};

function App() {
  // Main state
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState('form') // 'form', 'questions', 'stats'
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  
  // Game details
  const [gameDetails, setGameDetails] = useState({
    topic: '',
    level: 'beginner',
    count: 10
  })
  
  // Game progress
  const [gameStats, setGameStats] = useState([])
  const [savedGames, setSavedGames] = useState([])

  useEffect(() => {
    // Set the default theme on initial load
    document.documentElement.setAttribute('data-theme', 'mytheme');
    
    // Load saved games from localStorage
    loadSavedGames();
    
    // Check for an in-progress game
    const currentGame = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    if (currentGame) {
      try {
        const gameData = JSON.parse(currentGame);
        setGameDetails({
          topic: gameData.topic,
          level: gameData.level,
          count: gameData.questions.length
        });
        setQuestions(gameData.questions);
        setGameStats(gameData.progress?.stats || []);
        setCurrentCardIndex(gameData.progress?.currentIndex || 0);
        setCurrentStep('questions');
      } catch (e) {
        console.error('Error loading saved game:', e);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
      }
    }
  }, []);
  
  // Update current game in localStorage when game state changes
  useEffect(() => {
    if (questions.length > 0 && currentStep === 'questions') {
      const gameData = {
        topic: gameDetails.topic,
        level: gameDetails.level,
        questions,
        progress: {
          currentIndex: currentCardIndex,
          stats: gameStats,
        },
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameData));
    }
  }, [questions, currentCardIndex, gameStats, gameDetails, currentStep]);
  
  // Check if all cards have been answered
  useEffect(() => {
    if (
      questions.length > 0 && 
      gameStats.length > 0 && 
      gameStats.length >= questions.length && 
      currentStep === 'questions'
    ) {
      setCurrentStep('stats');
      // Clear current game when completed
      localStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
    }
  }, [questions, gameStats, currentStep]);
  
  const loadSavedGames = () => {
    try {
      const savedGamesJson = localStorage.getItem(STORAGE_KEYS.SAVED_GAMES);
      if (savedGamesJson) {
        const games = JSON.parse(savedGamesJson);
        setSavedGames(games);
      }
    } catch (e) {
      console.error('Error loading saved games:', e);
    }
  };
  
  const saveGame = (name) => {
    const gameData = {
      id: Date.now().toString(),
      name,
      topic: gameDetails.topic,
      level: gameDetails.level,
      questions,
      progress: {
        stats: gameStats,
      },
      timestamp: Date.now()
    };
    
    const updatedGames = [...savedGames, gameData];
    localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(updatedGames));
    setSavedGames(updatedGames);
  };
  
  const loadGame = (game) => {
    setGameDetails({
      topic: game.topic,
      level: game.level,
      count: game.questions.length
    });
    setQuestions(game.questions);
    setGameStats(game.progress?.stats || []);
    setCurrentCardIndex(0);
    setCurrentStep('questions');
  };
  
  const deleteGame = (gameId) => {
    const updatedGames = savedGames.filter(game => game.id !== gameId);
    localStorage.setItem(STORAGE_KEYS.SAVED_GAMES, JSON.stringify(updatedGames));
    setSavedGames(updatedGames);
  };

  const handleGenerateFlashcards = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const questions = await generateFlashcards(formData)
      
      // Save game details
      setGameDetails({
        topic: formData.topic,
        level: formData.level,
        count: formData.count
      });
      
      setQuestions(questions)
      setCurrentStep('questions')
      setCurrentCardIndex(0) // Reset to first card
      setGameStats([]) // Clear previous stats
    } catch (error) {
      setError(error.message || 'An error occurred while generating flashcards.')
    } finally {
      setIsLoading(false)
    }
  };

  const handleEvaluateAnswer = async (question, answer) => {
    try {
      return await evaluateAnswer(question, answer)
    } catch (error) {
      setError(error.message || 'An error occurred while evaluating your answer.')
      throw error
    }
  };

  const handleAnswerComplete = (result) => {
    // Add to game stats
    setGameStats(prevStats => {
      // Avoid duplicate entries
      const existingIndex = prevStats.findIndex(stat => stat.question === result.question);
      if (existingIndex >= 0) {
        const newStats = [...prevStats];
        newStats[existingIndex] = result;
        return newStats;
      } else {
        return [...prevStats, result];
      }
    });
    
    // Removed automatic advancement to next card
  };

  const handleRestart = () => {
    setCurrentStep('questions')
    setCurrentCardIndex(0)
    setGameStats([])
  };
  
  const handleNewGame = () => {
    setQuestions([])
    setCurrentStep('form')
    setError(null)
    setCurrentCardIndex(0)
    setGameStats([])
  };

  const goToNextCard = () => {
    if (currentCardIndex < questions.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100 bg-gradient-to-br from-base-100 via-base-100 to-neutral/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <Navbar />
      
      <main className="container relative z-10 flex-grow px-4 py-10 mx-auto" style={{background: '#000000ad'}}>
        <h1 className="mb-10 text-4xl font-bold text-center text-white md:text-5xl">Learn with AI-Powered Flashcards</h1>
        
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        
        {currentStep === 'form' && (
          <>
            <FlashcardForm onGenerate={handleGenerateFlashcards} isLoading={isLoading} />

            {isLoading && <Loading message="Generating your flashcards..." />}

            {/* Show saved games if available */}
            <SavedGamesList 
              savedGames={savedGames}
              onLoadGame={loadGame}
              onDeleteGame={deleteGame}
            />
          </>
        )}
        
        {currentStep === 'questions' && !isLoading && (
          <div className="max-w-3xl mx-auto fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Your Flashcards</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleNewGame} 
                  className="px-4 text-white rounded-lg btn btn-outline btn-sm btn-glow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Start Over
                </button>
              </div>
            </div>
            
            {questions.length > 0 ? (
              <div>
                {/* Game Info */}
                <div className="flex items-center justify-between mb-4 text-white">
                  <div>
                    <div className="text-sm opacity-70">Topic: <span className="font-semibold">{gameDetails.topic}</span></div>
                    <div className="text-sm opacity-70">Level: <span className="font-semibold">{gameDetails.level}</span></div>
                  </div>
                  <div className="badge badge-lg badge-primary">{gameStats.length}/{questions.length} Completed</div>
                </div>
                
                {/* Flashcard Progress Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-white/90">Card {currentCardIndex + 1} of {questions.length}</span>
                  </div>
                  <div className="w-64 h-2 overflow-hidden rounded-full bg-base-300">
                    <div 
                      className="h-full transition-all duration-300 rounded-full bg-primary"
                      style={{ width: `${((currentCardIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Flashcard */}
                <FlashcardCard 
                  key={currentCardIndex}
                  question={questions[currentCardIndex]}
                  onAnswer={handleEvaluateAnswer}
                  onComplete={handleAnswerComplete}
                />
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={goToPrevCard}
                    className="px-4 rounded-lg btn btn-outline btn-glow"
                    disabled={currentCardIndex === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Previous
                  </button>
                  <button 
                    onClick={goToNextCard}
                    className="px-4 rounded-lg btn btn-primary btn-glow"
                    disabled={currentCardIndex === questions.length - 1}
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-xl glass-card">
                <p className="text-white">No flashcards available. Please generate some flashcards first.</p>
              </div>
            )}
          </div>
        )}
        
        {/* End Game Stats Screen */}
        {currentStep === 'stats' && (
          <div className="max-w-4xl mx-auto fade-in">
            <GameStats 
              stats={gameStats} 
              onRestart={handleRestart}
              onNewGame={handleNewGame}
              onSaveGame={saveGame}
            />
          </div>
        )}
      </main>
      
      <footer className="relative z-10 p-6 border-t footer footer-center bg-base-300/50 backdrop-blur-sm text-base-content border-primary/10">
        <div>
          <p className="font-medium">© 2025 - FlashcardsAI - Learn smarter with AI</p>
        </div>
      </footer>
    </div>
  )
}

export default App

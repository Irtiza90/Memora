import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import FlashcardForm from './components/FlashcardForm'
import FlashcardCard from './components/FlashcardCard'
import ErrorAlert from './components/ErrorAlert'
import Loading from './components/Loading'
import { generateFlashcards, evaluateAnswer } from './services/api'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState('form') // 'form', 'questions'

  useEffect(() => {
    // Set the default theme on initial load
    document.documentElement.setAttribute('data-theme', 'mytheme');
  }, []);

  const handleGenerateFlashcards = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const questions = await generateFlashcards(formData)
      setQuestions(questions)
      setCurrentStep('questions')
    } catch (error) {
      setError(error.message || 'An error occurred while generating flashcards.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvaluateAnswer = async (question, answer) => {
    try {
      return await evaluateAnswer(question, answer)
    } catch (error) {
      setError(error.message || 'An error occurred while evaluating your answer.')
      throw error
    }
  }

  const handleRestart = () => {
    setQuestions([])
    setCurrentStep('form')
    setError(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-100 bg-gradient-to-br from-base-100 via-base-100 to-neutral/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <Navbar />
      
      <main className="container relative z-10 flex-grow px-4 py-6 mx-auto mb-8">
        <h1 className="mb-10 text-4xl font-bold text-center md:text-5xl text-gradient">Learn with AI-Powered Flashcards</h1>
        
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        
        {currentStep === 'form' && (
          <FlashcardForm onGenerate={handleGenerateFlashcards} isLoading={isLoading} />
        )}
        
        {isLoading && <Loading message="Generating your flashcards..." />}
        
        {currentStep === 'questions' && !isLoading && (
          <div className="max-w-3xl mx-auto fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gradient">Your Flashcards</h2>
              <button 
                onClick={handleRestart} 
                className="px-4 rounded-lg btn btn-outline btn-sm btn-glow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Start Over
              </button>
            </div>
            
            {questions.length > 0 ? (
              <div className="space-y-8">
                {questions.map((question, index) => (
                  <FlashcardCard 
                    key={index}
                    question={question}
                    onAnswer={handleEvaluateAnswer}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-xl glass-card">
                <p>No flashcards available. Please generate some flashcards first.</p>
              </div>
            )}
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

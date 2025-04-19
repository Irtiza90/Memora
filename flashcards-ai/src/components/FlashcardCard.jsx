import { useState, useEffect } from 'react';
import TypingAnimation from './TypingAnimation';

const FlashcardCard = ({ question, onAnswer, onComplete }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // Notify parent component when answer is evaluated
  useEffect(() => {
    if (feedback && isTypingComplete) {
      onComplete && onComplete({ 
        question, 
        answer, 
        rating: feedback.rating, 
        feedback: feedback.feedback 
      });
    }
  }, [feedback, isTypingComplete, question, answer, onComplete]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await onAnswer(question, answer);
      setFeedback(result);
      setIsSubmitted(true);
      setIsTypingComplete(false);
    } catch (error) {
      console.error("Error evaluating answer:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTryAgain = () => {
    setIsSubmitted(false);
    setFeedback(null);
    setIsTypingComplete(false);
  };
  
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-success font-bold';
    if (rating >= 2.5) return 'text-warning font-bold';
    return 'text-error font-bold';
  };

  const getRatingBg = (rating) => {
    if (rating >= 4) return 'bg-success/20';
    if (rating >= 2.5) return 'bg-warning/20';
    return 'bg-error/20';
  };

  const getRatingEmoji = (rating) => {
    if (rating >= 4) return '🌟';
    if (rating >= 2.5) return '👍';
    return '🔄';
  };
  
  return (
    <div className="w-full overflow-hidden shadow-xl glass-card border-opacity-20 border-primary/20 rounded-2xl fade-in">
      <div className="p-6 md:p-8">
        <div className="px-8 py-5 mb-6 -mx-8 -mt-8 border-b bg-primary/10 border-primary/20">
          <h2 className="text-xl font-bold text-white md:text-2xl">{question}</h2>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="form-control">
              <textarea
                className="w-full h-32 p-4 text-white rounded-lg resize-none textarea textarea-bordered textarea-glow bg-base-200/50 border-primary/30 focus:border-primary"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isLoading}
                autoFocus
              ></textarea>
            </div>
            <div className="flex justify-end mt-6">
              <button 
                type="submit" 
                className="px-6 rounded-lg btn btn-primary btn-glow"
                disabled={!answer.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Evaluating...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            {feedback && (
              <div className={`p-5 rounded-xl mb-4 ${getRatingBg(feedback.rating)} border-primary/20`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold tracking-wider text-white uppercase">Feedback</p>
                  <div className={`px-3 py-1 rounded-full ${getRatingBg(feedback.rating)} flex items-center gap-2`}>
                    <span className={getRatingColor(feedback.rating)}>
                      {getRatingEmoji(feedback.rating)} {feedback.rating}/5
                    </span>
                  </div>
                </div>
                <div className="leading-relaxed text-white">
                  {!isTypingComplete ? (
                    <TypingAnimation 
                      text={feedback.feedback} 
                      speed={2} 
                      onComplete={() => setIsTypingComplete(true)}
                    />
                  ) : (
                    feedback.feedback
                  )}
                </div>
              </div>
            )}

            <div className="p-5 mb-5 border bg-base-200/50 rounded-xl border-base-300">
              <p className="mb-2 text-sm font-bold tracking-wider text-white uppercase opacity-70">Your answer</p>
              <p className="leading-relaxed text-white whitespace-pre-wrap">{answer}</p>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleTryAgain} 
                className="px-6 text-white rounded-lg btn btn-outline btn-glow hover:text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardCard; 

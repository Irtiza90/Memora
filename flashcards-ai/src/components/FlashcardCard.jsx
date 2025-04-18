import { useState } from 'react';

const FlashcardCard = ({ question, onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await onAnswer(question, answer);
      setFeedback(result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error evaluating answer:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTryAgain = () => {
    setIsSubmitted(false);
    setFeedback(null);
  };
  
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-success';
    if (rating >= 2.5) return 'text-warning';
    return 'text-error';
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
    <div className="w-full overflow-hidden shadow-xl hover-card glass-card border-opacity-20 border-primary/20 rounded-2xl fade-in">
      <div className="p-6 md:p-8">
        <div className="px-8 py-5 mb-6 -mx-8 -mt-8 border-b bg-primary/10 border-primary/20">
          <h2 className="text-xl font-bold md:text-2xl text-gradient">{question}</h2>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="form-control">
              <textarea
                className="w-full h-32 p-4 rounded-lg resize-none textarea textarea-bordered textarea-glow bg-base-200/50 border-primary/30 focus:border-primary"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isLoading}
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
            <div className="p-5 mb-5 border bg-base-200/50 rounded-xl border-base-300">
              <p className="mb-2 text-sm font-bold tracking-wider uppercase opacity-70">Your answer</p>
              <p className="leading-relaxed">{answer}</p>
            </div>
            
            {feedback && (
              <div className={`p-5 rounded-xl ${getRatingBg(feedback.rating)} border border-opacity-20 border-primary/20`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold tracking-wider uppercase opacity-70">Feedback</p>
                  <div className={`px-3 py-1 rounded-full ${getRatingBg(feedback.rating)} flex items-center gap-2`}>
                    <span className={`${getRatingColor(feedback.rating)} font-bold`}>
                      {getRatingEmoji(feedback.rating)} {feedback.rating}/5
                    </span>
                  </div>
                </div>
                <p className="leading-relaxed">{feedback.feedback}</p>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleTryAgain} 
                className="px-6 rounded-lg btn btn-outline btn-glow"
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

import { useState, useEffect, useCallback } from 'react';
import TypingAnimation from './TypingAnimation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FlashcardCard = ({ question, onAnswer, onComplete }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // Notify parent component when answer is evaluated - optimized to run only once
  useEffect(() => {
    if (feedback && !isLoading) {
      console.log("Feedback received, notifying parent component");
      // Don't wait for typing animation to complete before recording the answer
      onComplete && onComplete({ 
        question, 
        answer, 
        rating: feedback.rating, 
        feedback: feedback.feedback 
      });
    }
  }, [feedback]); // Only depend on feedback changing
  
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
  
  // Memoize rating functions to prevent recreating on every render
  const getRatingColor = useCallback((rating) => {
    if (rating >= 4) return 'text-success font-bold';
    if (rating >= 2.5) return 'text-warning font-bold';
    return 'text-error font-bold';
  }, []);

  const getRatingBg = useCallback((rating) => {
    if (rating >= 4) return 'bg-success/20';
    if (rating >= 2.5) return 'bg-warning/20';
    return 'bg-error/20';
  }, []);

  const getRatingEmoji = useCallback((rating) => {
    if (rating >= 4) return '🌟';
    if (rating >= 2.5) return '👍';
    return '🔄';
  }, []);

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);
  
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
                <div className="leading-relaxed text-white markdown-content">
                  {!isTypingComplete ? (
                    <TypingAnimation 
                      text={feedback.feedback} 
                      speed={10} 
                      onComplete={handleTypingComplete}
                    />
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({...props}) => <h1 className="mt-4 mb-2 text-xl font-bold" {...props} />,
                        h2: ({...props}) => <h2 className="mt-3 mb-2 text-lg font-bold" {...props} />,
                        h3: ({...props}) => <h3 className="mt-3 mb-1 font-bold text-md" {...props} />,
                        p: ({...props}) => <p className="mb-2" {...props} />,
                        ul: ({...props}) => <ul className="mb-2 ml-5 list-disc" {...props} />,
                        ol: ({...props}) => <ol className="mb-2 ml-5 list-decimal" {...props} />,
                        li: ({...props}) => <li className="mb-1" {...props} />,
                        code: ({inline, className, children, ...props}) => {
                          // Force parsing of children as string
                          const codeContent = children ? String(children).replace(/\n$/, '') : '';
                          // Check for language indicator
                          const match = /language-(\w+)/.exec(className || '');
                          
                          // Handle differently based on whether it's inline code or a code block
                          if (!inline) {
                            // Code block (triple backticks)
                            return (
                              <pre className="inline-flex p-4 my-3 overflow-x-auto text-sm rounded-md bg-base-900/50">
                                <code
                                  className={match ? `language-${match[1]} block` : 'block'}
                                  {...props}
                                >
                                  {codeContent}
                                </code>
                              </pre>
                            );
                          } else {
                            // Inline code (single backticks) with special styling
                            return (
                              <code
                                className="px-1.5 py-0.5 mx-0.5 font-mono text-sm bg-base-300/50 text-primary-content rounded inline-code inline-flex"
                                {...props}
                              >
                                {codeContent}
                              </code>
                            );
                          }
                        },
                        a: ({...props}) => <a className="underline text-primary" {...props} />,
                        blockquote: ({...props}) => <blockquote className="py-2 pl-4 my-3 italic border-l-4 border-primary/30 bg-base-300/10" {...props} />,
                        table: ({...props}) => <div className="my-3 overflow-x-auto"><table className="w-full border-collapse" {...props} /></div>,
                        th: ({...props}) => <th className="p-2 text-left border border-base-600 bg-base-700/50" {...props} />,
                        td: ({...props}) => <td className="p-2 border border-base-700/50" {...props} />
                      }}
                    >
                      {feedback.feedback}
                    </ReactMarkdown>
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

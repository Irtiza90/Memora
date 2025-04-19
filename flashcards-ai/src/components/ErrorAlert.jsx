const ErrorAlert = ({ message, onDismiss, type = 'general' }) => {
  if (!message) return null;
  
  // Determine alert style based on error type
  let alertClass = 'max-w-2xl mx-auto mb-8 border shadow-lg alert bg-error/20 text-error-content border-error/30 rounded-xl fade-in';
  let title = 'Error';
  let displayMessage = message;
  let icon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  // Check for JSON decode error
  if (message.includes("Failed to parse JSON") || message.includes("JSONDecodeError")) {
    alertClass = 'max-w-2xl mx-auto mb-8 border shadow-lg alert bg-warning/20 text-warning-content border-warning/30 rounded-xl fade-in';
    title = 'Response Too Complex or Lengthy';
    displayMessage = "The AI couldn't format its response correctly. Please use fewer words in your answer and try again.";
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  } 
  // Customize based on error type
  else if (type === 'token_limit_exceeded') {
    alertClass = 'max-w-2xl mx-auto mb-8 border shadow-lg alert bg-warning/20 text-warning-content border-warning/30 rounded-xl fade-in';
    title = 'Token Limit Exceeded';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  } else if (type === 'rate_limit') {
    alertClass = 'max-w-2xl mx-auto mb-8 border shadow-lg alert bg-info/20 text-info-content border-info/30 rounded-xl fade-in';
    title = 'Rate Limit';
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  
  return (
    <div className={alertClass}>
      <div className="flex items-center">
        {icon}
        <div className="ml-2">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="text-sm opacity-90">{displayMessage}</div>
        </div>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          className="btn btn-sm btn-ghost text-error-content hover:bg-error/30"
          aria-label="Dismiss error"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorAlert; 

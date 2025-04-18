const ErrorAlert = ({ message, onDismiss }) => {
  if (!message) return null;
  
  return (
    <div className="max-w-2xl mx-auto mb-8 border shadow-lg alert alert-error bg-error/20 text-error-content border-error/30 rounded-xl fade-in">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="ml-2">
          <h3 className="text-lg font-bold">Error</h3>
          <div className="text-sm opacity-90">{message}</div>
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

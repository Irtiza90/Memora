const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 fade-in">
      <div className="relative">
        <div className="absolute rounded-full opacity-50 -inset-1 bg-gradient-to-r from-primary to-secondary blur-md animate-pulse"></div>
        <div className="relative p-2 rounded-full bg-base-300/50">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-center text-gradient">{message}</p>
    </div>
  );
};

export default Loading; 

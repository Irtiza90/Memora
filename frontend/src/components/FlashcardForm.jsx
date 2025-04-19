import { useState } from 'react';

const FlashcardForm = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [count, setCount] = useState(10);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    onGenerate({ topic, level, count });
  };
  
  return (
    <div className="max-w-2xl p-8 mx-auto mb-8 border shadow-xl glass-card rounded-2xl backdrop-blur-lg border-opacity-20 border-primary/20 fade-in">
      <h2 className="mb-6 text-3xl font-bold text-center text-white">Generate Flashcards</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="text-base font-medium text-white label-text">Topic</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., JavaScript, Machine Learning)"
            className="w-full h-12 text-white rounded-lg bg-base-200/50 input input-bordered input-glow border-primary/30 focus:border-primary"
            required
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="text-base font-medium text-white label-text">Level</span>
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full h-12 text-white rounded-lg bg-base-200/50 select select-bordered select-glow border-primary/30 focus:border-primary"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="text-base font-medium text-white label-text">Number of Flashcards</span>
            <span className="px-3 py-1 font-semibold rounded-full label-text-alt bg-primary/20 text-primary">{count}</span>
          </label>
          <input
            type="range"
            min="2"
            max="20"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="range range-primary"
            step="1"
          />
          {/* <div className="flex justify-between w-full px-2 mt-2 text-xs text-white">
            <span className="font-medium">10</span>
            <span className="font-medium">15</span>
            <span className="font-medium">20</span>
          </div> */}
        </div>
        
        <button
          type="submit"
          className="w-full h-12 mt-6 rounded-lg shadow-md btn btn-primary btn-glow"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Generating...
            </>
          ) : (
            'Generate Flashcards'
          )}
        </button>
      </form>
    </div>
  );
};

export default FlashcardForm; 

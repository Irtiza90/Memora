import { useState } from 'react';

const SavedGamesList = ({ savedGames, onLoadGame, onDeleteGame }) => {
  const [expandedGame, setExpandedGame] = useState(null);
  
  if (!savedGames || savedGames.length === 0) {
    return (
      <div className="alert bg-base-200/50 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span className="text-white">No saved decks found. Complete a session to save it for later!</span>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Your Saved Decks</h3>
      
      <div className="space-y-4">
        {savedGames.map((game, index) => (
          <div key={index} className="collapse collapse-arrow bg-base-200/50 rounded-xl">
            <input 
              type="radio" 
              name="saved-games-accordion"
              checked={expandedGame === index}
              onChange={() => setExpandedGame(expandedGame === index ? null : index)}
            />
            <div className="collapse-title text-white font-medium flex items-center justify-between pr-12">
              <div>
                <span className="font-bold">{game.name}</span>
                <div className="text-sm opacity-70">
                  {game.questions.length} questions • Created: {new Date(game.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="badge badge-primary">{game.level}</div>
            </div>
            <div className="collapse-content">
              <div className="pt-2">
                <p className="text-white mb-3">Topic: <span className="font-semibold">{game.topic}</span></p>
                <div className="flex gap-2 flex-wrap mt-4">
                  <button 
                    onClick={() => onLoadGame(game)} 
                    className="btn btn-primary btn-sm btn-glow"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                    Play This Deck
                  </button>
                  <button 
                    onClick={() => onDeleteGame(game.id)} 
                    className="btn btn-error btn-sm btn-outline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Delete
                  </button>
                </div>
                
                {game.progress && game.progress.stats && game.progress.stats.length > 0 && (
                  <div className="mt-4">
                    <div className="text-white text-sm font-semibold mb-2">Previous Performance:</div>
                    <div className="stats stats-horizontal shadow bg-base-300/50 text-white">
                      <div className="stat">
                        <div className="stat-title text-white/70">Score</div>
                        <div className="stat-value text-lg">{(game.progress.stats.reduce((acc, stat) => acc + (stat.rating || 0), 0) / game.progress.stats.length || 0).toFixed(1)}</div>
                        <div className="stat-desc text-white/60">Average Rating</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title text-white/70">Completion</div>
                        <div className="stat-value text-lg">{Math.round((game.progress.stats.length / game.questions.length) * 100)}%</div>
                        <div className="stat-desc text-white/60">Cards Answered</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedGamesList; 

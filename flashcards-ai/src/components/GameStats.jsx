import { useState } from 'react';

const GameStats = ({ stats, onRestart, onNewGame, onSaveGame }) => {
  const [gameName, setGameName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  const averageScore = stats.reduce((acc, stat) => acc + (stat.rating || 0), 0) / stats.length || 0;
  
  const getGrade = (score) => {
    if (score >= 4.5) return { letter: 'A+', color: 'text-success', emoji: '🏆' };
    if (score >= 4) return { letter: 'A', color: 'text-success', emoji: '🎯' };
    if (score >= 3.5) return { letter: 'B+', color: 'text-success', emoji: '👏' };
    if (score >= 3) return { letter: 'B', color: 'text-warning', emoji: '👍' };
    if (score >= 2.5) return { letter: 'C+', color: 'text-warning', emoji: '💪' };
    if (score >= 2) return { letter: 'C', color: 'text-warning', emoji: '🔍' };
    if (score >= 1.5) return { letter: 'D', color: 'text-error', emoji: '📚' };
    return { letter: 'F', color: 'text-error', emoji: '📝' };
  };
  
  const handleSaveGame = () => {
    if (!gameName.trim()) return;
    onSaveGame(gameName);
    setIsSaved(true);
  };
  
  const grade = getGrade(averageScore);
  
  // Calculate percentage of questions with good scores (3+)
  const goodAnswers = stats.filter(stat => (stat.rating || 0) >= 3).length;
  const goodAnswerPercentage = Math.round((goodAnswers / stats.length) * 100);
  
  return (
    <div className="w-full p-8 overflow-hidden shadow-xl glass-card border-opacity-20 border-primary/20 rounded-2xl fade-in">
      <h2 className="mb-6 text-2xl font-bold text-center text-white">Session Complete!</h2>
      
      <div className="flex flex-col gap-4 mb-8 md:flex-row">
        <div className="text-center border stat bg-base-200/50 rounded-xl border-primary/10">
          <div className="text-4xl stat-figure text-primary">
            {grade.emoji}
          </div>
          <div className="stat-title text-white/70">Overall Grade</div>
          <div className={`stat-value ${grade.color}`}>{grade.letter}</div>
          <div className="stat-desc text-white/60">Average Score: {averageScore.toFixed(1)}/5</div>
        </div>
        
        <div className="text-center border stat bg-base-200/50 rounded-xl border-primary/10">
          <div className="text-white stat-figure">
            <div className="radial-progress text-primary" style={{"--value": goodAnswerPercentage}} role="progressbar">{goodAnswerPercentage}%</div>
          </div>
          <div className="stat-title text-white/70">Success Rate</div>
          <div className="text-white stat-value">{goodAnswers}/{stats.length}</div>
          <div className="stat-desc text-white/60">Questions with good scores</div>
        </div>
        
        <div className="text-center border stat bg-base-200/50 rounded-xl border-primary/10">
          <div className="text-4xl stat-figure text-secondary">
            🧠
          </div>
          <div className="stat-title text-white/70">Questions</div>
          <div className="text-white stat-value">{stats.length}</div>
          <div className="stat-desc text-white/60">Cards completed</div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="mb-3 text-lg font-bold text-white">Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="table bg-base-200/30 rounded-xl">
            <thead>
              <tr className="text-white">
                <th className="bg-base-300/50">#</th>
                <th className="bg-base-300/50">Question</th>
                <th className="bg-base-300/50">Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item, index) => (
                <tr key={index} className="text-white hover:bg-base-300/30">
                  <td>{index + 1}</td>
                  <td className="max-w-xs truncate">{item.question}</td>
                  <td>
                    <div className={`badge ${item.rating >= 4 ? 'badge-success' : item.rating >= 2.5 ? 'badge-warning' : 'badge-error'}`}>
                      {item.rating?.toFixed(1) || 'N/A'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {!isSaved && (
        <div className="mb-6 form-control">
          <label className="label">
            <span className="text-base font-medium text-white label-text">Save this deck for later</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter a name for this deck"
              className="flex-1 h-12 text-white rounded-lg bg-base-200/50 input input-bordered input-glow border-primary/30 focus:border-primary"
            />
            <button 
              onClick={handleSaveGame}
              disabled={!gameName.trim()}
              className="h-12 px-4 btn btn-primary btn-glow"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {isSaved && (
        <div className="mt-4 mb-0 border alert alert-success bg-success/20 border-success/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-white">Deck saved successfully! You can access it from the home screen.</span>
        </div>
      )}
      
      <div className="flex flex-col justify-center gap-4 mt-4 mb-0 sm:flex-row">
        <button onClick={onRestart} className="btn btn-primary btn-glow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Restart This Deck
        </button>
        <button onClick={onNewGame} className="text-white btn btn-outline btn-glow hover:bg-primary/20 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Deck
        </button>
      </div>
    </div>
  );
};

export default GameStats; 

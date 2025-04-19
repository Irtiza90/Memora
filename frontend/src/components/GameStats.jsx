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
    <div className="w-full p-4 overflow-hidden shadow-xl md:p-8 glass-card border-opacity-20 border-primary/20 rounded-2xl fade-in">
      <h2 className="mb-4 text-xl font-bold text-center text-white md:mb-6 md:text-2xl">Session Complete!</h2>
      
      <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-4 md:mb-8">
        <div className="text-center border stat bg-base-200/50 rounded-xl border-primary/10">
          <div className="text-3xl md:text-4xl stat-figure text-primary">
            {grade.emoji}
          </div>
          <div className="text-sm stat-title text-white/70 md:text-base">Overall Grade</div>
          <div className={`stat-value text-2xl md:text-3xl ${grade.color}`}>{grade.letter}</div>
          <div className="text-xs stat-desc text-white/60 md:text-sm">Average Score: {averageScore.toFixed(1)}/5</div>
        </div>
        
        <div className="text-center border stat bg-base-200/50 rounded-xl border-primary/10">
          <div className="text-white stat-figure">
            <div className="text-sm radial-progress text-primary md:text-base" style={{"--value": goodAnswerPercentage, "--size": "3rem", "--thickness": "0.5rem"}} role="progressbar">{goodAnswerPercentage}%</div>
          </div>
          <div className="text-sm stat-title text-white/70 md:text-base">Success Rate</div>
          <div className="text-2xl text-white stat-value md:text-3xl">{goodAnswers}/{stats.length}</div>
          <div className="text-xs stat-desc text-white/60 md:text-sm">Questions with good scores</div>
        </div>
        
        <div className="col-span-1 text-center border stat bg-base-200/50 rounded-xl border-primary/10 sm:col-span-2 lg:col-span-1">
          <div className="text-3xl md:text-4xl stat-figure text-secondary">
            🧠
          </div>
          <div className="text-sm stat-title text-white/70 md:text-base">Questions</div>
          <div className="text-2xl text-white stat-value md:text-3xl">{stats.length}</div>
          <div className="text-xs stat-desc text-white/60 md:text-sm">Cards completed</div>
        </div>
      </div>
      
      <div className="mb-6 md:mb-8">
        <h3 className="mb-2 text-base font-bold text-white md:mb-3 md:text-lg">Performance Summary</h3>
        <div className="-mx-4 overflow-x-auto md:mx-0">
          <table className="table w-full table-sm md:table-md bg-base-200/30 rounded-xl">
            <thead>
              <tr className="text-xs text-white md:text-sm">
                <th className="bg-base-300/50">#</th>
                <th className="bg-base-300/50">Question</th>
                <th className="bg-base-300/50">Score</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((item, index) => (
                <tr key={index} className="text-xs text-white hover:bg-base-300/30 md:text-sm">
                  <td>{index + 1}</td>
                  <td className="max-w-[8rem] sm:max-w-xs truncate">{item.question}</td>
                  <td>
                    <div className={`badge badge-sm md:badge-md ${item.rating >= 4 ? 'badge-success' : item.rating >= 2.5 ? 'badge-warning' : 'badge-error'}`}>
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
        <div className="mb-4 md:mb-6 form-control">
          <label className="label">
            <span className="text-sm font-medium text-white md:text-base label-text">Save this deck for later</span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter a name for this deck"
              className="flex-1 h-10 py-4 text-sm text-white rounded-lg md:py-2 md:h-12 md:text-base bg-base-200/50 input input-bordered input-glow border-primary/30 focus:border-primary"
            />
            <button 
              onClick={handleSaveGame}
              disabled={!gameName.trim()}
              className="h-10 px-4 text-sm md:h-12 btn btn-primary btn-glow md:text-base"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {isSaved && (
        <div className="mt-4 mb-0 text-xs border alert alert-success bg-success/20 border-success/30 md:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 stroke-current md:w-6 md:h-6 shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-white">Deck saved successfully! You can access it from the home screen.</span>
        </div>
      )}
      
      <div className="flex flex-col justify-center gap-2 mt-4 mb-0 md:gap-4 sm:flex-row">
        <button onClick={onRestart} className="text-xs btn btn-sm md:btn-md btn-primary btn-glow md:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 md:w-5 md:h-5 md:mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Restart This Deck
        </button>
        <button onClick={onNewGame} className="text-xs text-white btn btn-sm md:btn-md btn-outline btn-glow hover:bg-primary/20 hover:text-white md:text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 md:w-5 md:h-5 md:mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Deck
        </button>
      </div>
    </div>
  );
};

export default GameStats; 

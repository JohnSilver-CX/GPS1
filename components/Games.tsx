
import React, { useState, useEffect, useCallback } from 'react';
import { MemoryCard } from '../types.ts';
import { GAME_EMOJIS } from '../constants.tsx';

// --- Reusable Game Over Overlay ---
const GameOver: React.FC<{ score: number; onRestart: () => void; onBack: () => void; color: string }> = ({ score, onRestart, onBack, color }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[3rem] animate-pop-in p-8 transition-all duration-700">
    <div className="text-center">
      <div className="text-6xl mb-4">😵</div>
      <h3 className="text-4xl font-display font-bold text-kids-dark dark:text-white mb-2">Game Over!</h3>
      <p className="text-xl font-bold mb-8" style={{ color }}>Final Score: {score}</p>
      <div className="flex flex-col gap-4">
        <button 
          onClick={onRestart} 
          className="px-10 py-4 text-white font-bold rounded-2xl shadow-fun transition-all hover:scale-105"
          style={{ backgroundColor: color }}
        >
          Try Again 🔄
        </button>
        <button 
          onClick={onBack} 
          className="text-gray-500 dark:text-gray-400 font-bold hover:underline"
        >
          Back to Menu
        </button>
      </div>
    </div>
  </div>
);

// --- Memory Match Game ---
const MemoryMatch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [misses, setMisses] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const MAX_MISSES = 10;

  const initGame = useCallback(() => {
    const doubleEmojis = [...GAME_EMOJIS, ...GAME_EMOJIS];
    const shuffled = doubleEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMatches(0);
    setMisses(0);
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleFlip = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length === 2 || isGameOver) return;
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [idx1, idx2] = newFlipped;
      if (cards[idx1].emoji === cards[idx2].emoji) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[idx1].isMatched = true;
          matchedCards[idx2].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches((prev) => prev + 1);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[idx1].isFlipped = false;
          resetCards[idx2].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setMisses(m => {
            const next = m + 1;
            if (next >= MAX_MISSES) setIsGameOver(true);
            return next;
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 rounded-[3rem] p-8 shadow-kids-xl border-4 border-kids-green text-center max-w-2xl mx-auto animate-pop-in relative overflow-hidden transition-all duration-700">
      {isGameOver && <GameOver score={matches * 10} onRestart={initGame} onBack={onBack} color="#22C55E" />}
      <button onClick={onBack} className="float-left text-kids-green font-bold hover:scale-110 transition">← Back</button>
      <h3 className="text-3xl font-display font-bold text-kids-green mb-2">🧩 Memory Match</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Find pairs! Misses: {misses}/{MAX_MISSES}</p>
      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto mb-8">
        {cards.map((card, index) => (
          <div key={card.id} onClick={() => handleFlip(index)} className="aspect-square relative cursor-pointer group">
            <div className={`absolute inset-0 flex items-center justify-center rounded-2xl border-4 transition-all duration-500 ${card.isFlipped || card.isMatched ? 'bg-white dark:bg-slate-700 border-kids-green rotate-y-180' : 'bg-kids-green border-white shadow-md group-hover:scale-105'}`}>
              <span className="text-3xl">{card.isFlipped || card.isMatched ? card.emoji : '?'}</span>
            </div>
          </div>
        ))}
      </div>
      {matches === GAME_EMOJIS.length && <div className="text-2xl font-bold text-kids-pink animate-bounce mb-6">Amazing! You won! 🌟</div>}
      <button onClick={initGame} className="px-10 py-4 bg-kids-green text-white font-bold rounded-full shadow-fun hover:translate-y-1 hover:shadow-none transition">Restart 🔄</button>
    </div>
  );
};

// --- Math Whiz Game ---
const MathWhiz: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const generateProblem = useCallback(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    const isPlus = Math.random() > 0.5;
    const ans = isPlus ? n1 + n2 : Math.max(0, n1 - n2);
    setProblem({ q: `${n1} ${isPlus ? '+' : '-'} ${n2} = ?`, a: ans });
    const opts = [ans];
    while (opts.length < 3) {
      const r = Math.max(0, ans + Math.floor(Math.random() * 6) - 3);
      if (!opts.includes(r)) opts.push(r);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  }, []);

  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    generateProblem();
  };

  useEffect(() => { generateProblem(); }, [generateProblem]);

  const handleAnswer = (val: number) => {
    if (val === problem.a) {
      setScore(score + 10);
      generateProblem();
    } else {
      setIsGameOver(true);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 rounded-[3rem] p-8 shadow-kids-xl border-4 border-kids-blue text-center max-w-xl mx-auto animate-pop-in relative overflow-hidden min-h-[450px] transition-all duration-700">
      {isGameOver && <GameOver score={score} onRestart={resetGame} onBack={onBack} color="#3B82F6" />}
      <button onClick={onBack} className="float-left text-kids-blue font-bold hover:scale-110 transition">← Back</button>
      <h3 className="text-3xl font-display font-bold text-kids-blue mb-2">🧮 Math Whiz</h3>
      <div className="bg-blue-50 dark:bg-slate-900 rounded-3xl p-10 mb-8 border-2 border-blue-100 dark:border-slate-700 transition-all duration-700">
        <div className="text-6xl font-display font-bold text-kids-dark dark:text-white mb-4">{problem.q}</div>
        <div className="text-xl font-black text-kids-blue uppercase tracking-widest">Score: {score}</div>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)} className="bg-white dark:bg-slate-700 border-4 border-kids-blue text-kids-blue dark:text-kids-blue text-3xl font-display font-bold py-6 rounded-3xl hover:bg-kids-blue hover:text-white dark:hover:text-white shadow-fun transition-all active:scale-95">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Emoji Pop Game ---
const EmojiPop: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [activeEmoji, setActiveEmoji] = useState({ emoji: '🎈', top: '50%', left: '50%' });
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const moveEmoji = useCallback(() => {
    const randomEmoji = GAME_EMOJIS[Math.floor(Math.random() * GAME_EMOJIS.length)];
    const top = Math.random() * 70 + 15 + '%';
    const left = Math.random() * 70 + 15 + '%';
    setActiveEmoji({ emoji: randomEmoji, top, left });
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  useEffect(() => { moveEmoji(); }, [moveEmoji]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    moveEmoji();
  };

  const handlePop = () => {
    setScore(s => s + 1);
    moveEmoji();
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 rounded-[3rem] p-8 shadow-kids-xl border-4 border-kids-pink text-center max-w-xl mx-auto h-[500px] relative overflow-hidden animate-pop-in transition-all duration-700">
      {isGameOver && <GameOver score={score} onRestart={resetGame} onBack={onBack} color="#EC4899" />}
      <button onClick={onBack} className="absolute top-8 left-8 text-kids-pink font-bold z-20">← Back</button>
      <h3 className="text-3xl font-display font-bold text-kids-pink mb-2">🎈 Emoji Pop</h3>
      <p className="text-gray-600 dark:text-gray-400 font-bold mb-4">Score: {score} | Time: {timeLeft}s</p>
      <div 
        onClick={handlePop}
        className="absolute w-24 h-24 flex items-center justify-center text-6xl cursor-pointer transition-all duration-300 hover:scale-125 animate-bounce-subtle"
        style={{ top: activeEmoji.top, left: activeEmoji.left }}
      >
        {activeEmoji.emoji}
      </div>
    </div>
  );
};

// --- Spelling Bee Game ---
const SpellingBee: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const words = ['APPLE', 'ROBOT', 'SCHOOL', 'DOGGY', 'HAPPY', 'WATER', 'LEMON', 'MANGO', 'TIGER'];
  const [word, setWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const nextWord = useCallback(() => {
    const w = words[Math.floor(Math.random() * words.length)];
    setWord(w);
    setScrambled(w.split('').sort(() => Math.random() - 0.5).join(''));
    setInput('');
    setMessage('');
    setRevealed(false);
  }, []);

  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    nextWord();
  };

  useEffect(() => { nextWord(); }, [nextWord]);

  const check = () => {
    if (input.toUpperCase() === word) {
      setScore(s => s + 10);
      setMessage('✨ Brilliant! ✨');
      setTimeout(nextWord, 1000);
    } else {
      setIsGameOver(true);
    }
  };

  const handleGiveUp = () => {
    setRevealed(true);
    setInput(word);
    setMessage(`The word was ${word}! 🐝`);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 rounded-[3rem] p-8 shadow-kids-xl border-4 border-kids-purple text-center max-w-xl mx-auto animate-pop-in relative overflow-hidden min-h-[500px] transition-all duration-700">
      {isGameOver && <GameOver score={score} onRestart={resetGame} onBack={onBack} color="#A855F7" />}
      <button onClick={onBack} className="float-left text-kids-purple font-bold">← Back</button>
      <h3 className="text-3xl font-display font-bold text-kids-purple mb-4">🐝 Spelling Bee</h3>
      <div className="bg-purple-50 dark:bg-slate-900 p-8 rounded-3xl mb-6 transition-all duration-700">
        <div className="text-sm font-black text-kids-purple uppercase tracking-widest mb-2">Unscramble this:</div>
        <div className="text-5xl font-display font-bold tracking-[0.5em] text-gray-700 dark:text-gray-300">{scrambled}</div>
      </div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value.toUpperCase())}
        className="w-full text-center text-3xl font-display border-4 border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded-2xl py-4 mb-4 outline-none focus:border-kids-purple uppercase transition-all duration-700"
        placeholder="Type here..."
        disabled={revealed}
      />
      <div className="flex gap-4">
        <button onClick={check} className="flex-1 bg-kids-purple text-white py-4 rounded-2xl font-bold shadow-fun hover:scale-105 transition">Check Word! ✅</button>
        <button onClick={handleGiveUp} className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-6 rounded-2xl font-bold border-2 border-gray-200 dark:border-slate-600 hover:bg-gray-200 transition">Give Up? 🏳️</button>
      </div>
      {revealed && (
        <button onClick={nextWord} className="mt-4 w-full bg-kids-teal text-white py-3 rounded-xl font-bold animate-bounce">
          Try Another Word! ➡️
        </button>
      )}
      <div className="mt-4 font-bold text-kids-pink h-6">{message}</div>
      <div className="mt-2 text-kids-purple font-black">Score: {score}</div>
    </div>
  );
};

// --- Color Quest Game ---
const ColorQuest: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const colors = [
    { name: 'Blue', hex: 'bg-kids-blue' },
    { name: 'Yellow', hex: 'bg-kids-yellow' },
    { name: 'Green', hex: 'bg-kids-green' },
    { name: 'Pink', hex: 'bg-kids-pink' },
    { name: 'Purple', hex: 'bg-kids-purple' },
    { name: 'Orange', hex: 'bg-kids-orange' }
  ];
  const [target, setTarget] = useState(colors[0]);
  const [options, setOptions] = useState(colors);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const nextColor = useCallback(() => {
    const t = colors[Math.floor(Math.random() * colors.length)];
    setTarget(t);
    setOptions([...colors].sort(() => Math.random() - 0.5));
  }, []);

  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    nextColor();
  };

  useEffect(() => { nextColor(); }, [nextColor]);

  const handlePick = (hex: string) => {
    if (hex === target.hex) {
      setScore(s => s + 1);
      nextColor();
    } else {
      setIsGameOver(true);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 rounded-[3rem] p-8 shadow-kids-xl border-4 border-kids-orange text-center max-w-xl mx-auto animate-pop-in relative overflow-hidden min-h-[450px] transition-all duration-700">
      {isGameOver && <GameOver score={score} onRestart={resetGame} onBack={onBack} color="#F97316" />}
      <button onClick={onBack} className="float-left text-kids-orange font-bold">← Back</button>
      <h3 className="text-3xl font-display font-bold text-kids-orange mb-2">🎨 Color Quest</h3>
      <p className="mb-6 font-bold dark:text-gray-300">Pick the <span className="text-kids-dark dark:text-white uppercase text-xl border-b-4 border-kids-orange">{target.name}</span> block!</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {options.map((c, i) => (
          <div key={i} onClick={() => handlePick(c.hex)} className={`${c.hex} aspect-square rounded-3xl cursor-pointer hover:scale-105 transition shadow-md border-4 border-white dark:border-slate-700`}></div>
        ))}
      </div>
      <div className="text-xl font-black text-kids-orange">Score: {score}</div>
    </div>
  );
};

// --- Quick Count Game ---
const QuickCount: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const nextCount = useCallback(() => {
    const num = Math.floor(Math.random() * 8) + 1;
    const emoji = GAME_EMOJIS[Math.floor(Math.random() * GAME_EMOJIS.length)];
    setCount(num);
    setItems(new Array(num).fill(emoji));
    const opts = [num];
    while (opts.length < 3) {
      const r = Math.floor(Math.random() * 10) + 1;
      if (!opts.includes(r)) opts.push(r);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  }, []);

  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    nextCount();
  };

  useEffect(() => { nextCount(); }, [nextCount]);

  const handleAnswer = (val: number) => {
    if (val === count) {
      setScore(s => s + 1);
      nextCount();
    } else {
      setIsGameOver(true);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 rounded-[3rem] p-8 shadow-kids-xl border-4 border-kids-teal text-center max-w-xl mx-auto animate-pop-in relative overflow-hidden min-h-[450px] transition-all duration-700">
      {isGameOver && <GameOver score={score} onRestart={resetGame} onBack={onBack} color="#06B6D4" />}
      <button onClick={onBack} className="float-left text-kids-teal font-bold">← Back</button>
      <h3 className="text-3xl font-display font-bold text-kids-teal mb-4">🔢 Quick Count</h3>
      <div className="bg-teal-50 dark:bg-slate-900 p-8 rounded-3xl mb-8 flex flex-wrap justify-center gap-4 min-h-[120px] transition-all duration-700">
        {items.map((item, i) => <span key={i} className="text-4xl animate-bounce-subtle">{item}</span>)}
      </div>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)} className="bg-white dark:bg-slate-700 border-4 border-kids-teal text-kids-teal text-4xl font-display font-bold py-4 rounded-2xl hover:bg-kids-teal hover:text-white transition">
            {opt}
          </button>
        ))}
      </div>
      <div className="text-xl font-black text-kids-teal">Score: {score}</div>
    </div>
  );
};

// --- Main Games Section ---
export const GamesSection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    { id: 'memory', title: 'Memory Match', icon: '🧩', color: 'bg-kids-green', desc: 'Find the twins!' },
    { id: 'math', title: 'Math Whiz', icon: '🧮', color: 'bg-kids-blue', desc: 'Numbers are fun!' },
    { id: 'pop', title: 'Emoji Pop', icon: '🎈', color: 'bg-kids-pink', desc: 'Pop pop pop!' },
    { id: 'spell', title: 'Spelling Bee', icon: '🐝', color: 'bg-kids-purple', desc: 'Unscramble words!' },
    { id: 'color', title: 'Color Quest', icon: '🎨', color: 'bg-kids-orange', desc: 'Find the rainbow!' },
    { id: 'count', title: 'Quick Count', icon: '🔢', color: 'bg-kids-teal', desc: '1, 2, 3... Go!' }
  ];

  if (selectedGame === 'memory') return <MemoryMatch onBack={() => setSelectedGame(null)} />;
  if (selectedGame === 'math') return <MathWhiz onBack={() => setSelectedGame(null)} />;
  if (selectedGame === 'pop') return <EmojiPop onBack={() => setSelectedGame(null)} />;
  if (selectedGame === 'spell') return <SpellingBee onBack={() => setSelectedGame(null)} />;
  if (selectedGame === 'color') return <ColorQuest onBack={() => setSelectedGame(null)} />;
  if (selectedGame === 'count') return <QuickCount onBack={() => setSelectedGame(null)} />;

  return (
    <div className="space-y-12">
      <div className="max-w-3xl mx-auto text-center bg-white/60 dark:bg-slate-800/60 p-8 rounded-[3rem] shadow-sm border-2 border-white dark:border-slate-700 transition-all duration-700">
        <p className="text-lg text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
          Welcome to the <strong>Gurukul Fun Zone</strong>! These games are designed by our AI experts to improve your memory, math skills, and spelling while you have a blast. Which adventure will you choose today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <div 
            key={game.id} 
            onClick={() => setSelectedGame(game.id)}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-kids-xl hover:-translate-y-4 transition-all border-4 border-transparent hover:border-white dark:hover:border-slate-600 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${game.color} opacity-10 rounded-bl-[4rem] group-hover:scale-150 transition-transform`}></div>
            <div className={`${game.color} w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-lg transform group-hover:rotate-12 transition-transform`}>
              {game.icon}
            </div>
            <h3 className="text-2xl font-display font-bold text-kids-dark dark:text-white mb-2">{game.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">{game.desc}</p>
            <button className={`${game.color} text-white px-6 py-2 rounded-full font-bold shadow-md group-hover:px-8 transition-all`}>
              Start Game 🚀
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';

interface TransitionPageProps {
  messages: string[];
  isReady: boolean;
}

const TransitionPage: React.FC<TransitionPageProps> = ({ messages, isReady }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isCycleComplete, setIsCycleComplete] = useState(false);

  useEffect(() => {
    if (isReady) {
      // If the component becomes ready, we can stop any further message cycling.
      setIsCycleComplete(true);
      return;
    };

    // Reset completion state if messages change (for retries, etc.)
    setIsCycleComplete(false);

    const interval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => {
        if (prevIndex >= messages.length - 1) {
          clearInterval(interval);
          setIsCycleComplete(true); // Signal that the main messages are done
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 4500); // 4.5 seconds per message

    return () => clearInterval(interval);
  }, [messages, isReady]);

  const renderContent = () => {
    if (isReady) {
      return (
        <p 
          key="final-message"
          className="text-slate-300 tracking-wider text-lg italic" 
          style={{ animation: `text-fade-in-out 2.5s ease-in-out forwards` }}
        >
          Interpretation Received...
        </p>
      );
    }

    if (isCycleComplete) {
      return (
        <p className="text-slate-300 tracking-wider text-lg italic animate-pulse">
          Hang tight... Almost there...
        </p>
      );
    }
    
    return (
      <p 
        key={currentMessageIndex} 
        className="text-slate-300 tracking-wider text-lg italic" 
        style={{ animation: `text-fade-in-out 4.5s ease-in-out forwards` }}
      >
        {messages[currentMessageIndex]}
      </p>
    );
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900 flex items-center justify-center">
      {/* Background elements for the transition */}
      <div className="absolute top-1/4 -left-1/4 w-full h-20 bg-gradient-to-r from-purple-600 to-transparent filter blur-2xl opacity-50" style={{ animation: 'glowing-ribbon 10s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 -right-1/4 w-full h-16 bg-gradient-to-l from-pink-500 to-transparent filter blur-2xl opacity-40" style={{ animation: 'glowing-ribbon 12s 2s ease-in-out infinite' }} />
      
      <div className="absolute w-48 h-48 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-30" style={{ animation: 'move-across 20s linear infinite alternate' }} />
      <div className="absolute w-32 h-32 bg-purple-400 rounded-full mix-blend-screen filter blur-3xl opacity-40" style={{ animation: 'move-across 25s 5s linear infinite alternate-reverse' }} />

      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const style = {
          width: `${size}px`,
          height: `${size}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * 5 + 5}s`,
        };
        return <div key={i} className="absolute bg-white rounded-full opacity-70 animate-twinkle" style={{ ...style }} />;
      })}

      {/* Dynamic Text */}
      <div className="relative z-10 text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default TransitionPage;
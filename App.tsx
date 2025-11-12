import React, { useState, useCallback, useRef, useEffect } from 'react';
import { interpretDream, generateSpeech } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audioUtils';
import { getRandomContent } from './utils/dreamContent';
import InputPage from './components/pages/InputPage';
import TransitionPage from './components/pages/TransitionPage';
import InterpretationPage from './components/pages/InterpretationPage';

type View = 'input' | 'loading' | 'interpretation';

const App: React.FC = () => {
  const [view, setView] = useState<View>('input');
  const [dream, setDream] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
  const [isInterpretationReady, setIsInterpretationReady] = useState<boolean>(false);

  const parallaxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!parallaxContainerRef.current) return;

      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const mouseX = clientX / innerWidth - 0.5;
      const mouseY = clientY / innerHeight - 0.5;

      const layers = parallaxContainerRef.current.querySelectorAll<HTMLElement>('[data-depth]');
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth || '0');
        const moveX = mouseX * depth * -1;
        const moveY = mouseY * depth * -1;
        
        layer.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleInterpretRequest = useCallback(async () => {
    if (!dream.trim()) {
      setError('Please describe your dream before interpreting.');
      return;
    }
    setError(null);
    setLoadingMessages(getRandomContent(4));
    setIsInterpretationReady(false); // Reset readiness state
    setView('loading');

    try {
      // 1. Get interpretation text
      const interpretationText = await interpretDream(dream);
      setInterpretation(interpretationText);

      // 2. Generate audio from the text
      const base64Audio = await generateSpeech(interpretationText);
      const audioData = decode(base64Audio);
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(audioData, context, 24000, 1);
      
      setAudioBuffer(buffer);

      // 3. Signal that work is done
      setIsInterpretationReady(true);
      
      // 4. Wait for a moment before transitioning to allow user to read final message
      setTimeout(() => {
        setView('interpretation');
      }, 2500);

    } catch (err) {
      console.error(err);
      setError('An error occurred on the journey into your dream. Please try again.');
      setView('input'); // Reset to input page on error
    }
  }, [dream]);

  const handleReset = () => {
    setDream('');
    setInterpretation('');
    setAudioBuffer(null);
    setError(null);
    setView('input');
  };

  const renderView = () => {
    switch (view) {
      case 'loading':
        return <TransitionPage messages={loadingMessages} isReady={isInterpretationReady} />;
      case 'interpretation':
        return <InterpretationPage text={interpretation} audioBuffer={audioBuffer} onReset={handleReset} />;
      case 'input':
      default:
        return <InputPage dream={dream} setDream={setDream} onInterpret={handleInterpretRequest} error={error} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-white overflow-hidden font-sans">
      {/* Animated background elements */}
      <div
        ref={parallaxContainerRef}
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
      >
        <div className="w-full h-full">
            {/* Orb 1 */}
            <div data-depth="20" className="absolute inset-0 transition-transform duration-300 ease-out">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse slow-spin-1"></div>
            </div>
            {/* Orb 2 */}
            <div data-depth="-30" className="absolute inset-0 transition-transform duration-300 ease-out">
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse slow-spin-2"></div>
            </div>
            {/* Orb 3 */}
            <div data-depth="50" className="absolute inset-0 transition-transform duration-300 ease-out">
              <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 orb-float"></div>
            </div>
            {/* Twinkling Stars */}
            <div data-depth="15" className="absolute inset-0 transition-transform duration-300 ease-out">
                <div className="absolute top-[10%] left-[80%] w-4 h-4 bg-pink-300 rounded-full filter blur-sm opacity-70 animate-twinkle"></div>
            </div>
            <div data-depth="-25" className="absolute inset-0 transition-transform duration-300 ease-out">
                <div className="absolute top-[70%] left-[10%] w-6 h-6 bg-purple-300 rounded-full filter blur-md opacity-60 animate-twinkle" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
            </div>
            <div data-depth="40" className="absolute inset-0 transition-transform duration-300 ease-out">
                <div className="absolute top-[40%] left-[50%] w-3 h-3 bg-white rounded-full filter blur-sm opacity-80 animate-twinkle" style={{ animationDelay: '4s', animationDuration: '5s' }}></div>
            </div>
            <div data-depth="-10" className="absolute inset-0 transition-transform duration-300 ease-out">
                <div className="absolute top-[90%] left-[90%] w-5 h-5 bg-indigo-200 rounded-full filter blur-sm opacity-50 animate-twinkle" style={{ animationDelay: '1s', animationDuration: '8s' }}></div>
            </div>
        </div>
      </div>
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
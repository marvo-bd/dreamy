import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SpeakerIcon } from '../icons/SpeakerIcon';
import { PauseIcon } from '../icons/PauseIcon';
import { StopCircleIcon } from '../icons/StopCircleIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

type AudioState = 'playing' | 'paused' | 'stopped' | 'idle';

interface InterpretationPageProps {
  text: string;
  audioBuffer: AudioBuffer | null;
  onReset: () => void;
}

const InterpretationPage: React.FC<InterpretationPageProps> = ({ text, audioBuffer, onReset }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [showListenPrompt, setShowListenPrompt] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const cleanupAudio = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      try { audioSourceRef.current.stop(); } catch (e) { /* ignore */ }
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    audioContextRef.current = null;
  }, []);
  
  const startPlayback = useCallback(() => {
    if (!audioBuffer || audioState === 'playing') return;

    cleanupAudio(); // Ensure no lingering contexts
    
    const context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: audioBuffer.sampleRate });
    audioContextRef.current = context;

    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.onended = () => setAudioState('stopped');
    source.start();
    
    audioSourceRef.current = source;
    setAudioState('playing');

  }, [audioBuffer, audioState, cleanupAudio]);


  // Effect for the typing animation
  useEffect(() => {
    setDisplayedText('');
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < text.length) {
          setDisplayedText((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(intervalId);
        }
      }, 20);

      return () => clearInterval(intervalId);
    }
  }, [text]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanupAudio();
  }, [cleanupAudio]);

  const handlePlayPause = async () => {
    const context = audioContextRef.current;
    if (!context) {
        if(audioState === 'idle' || audioState === 'stopped') {
            startPlayback();
        }
        return;
    };

    if (context.state === 'running') {
      await context.suspend();
      setAudioState('paused');
    } else if (context.state === 'suspended') {
      await context.resume();
      setAudioState('playing');
    }
  };
  
  const handleStop = () => {
    cleanupAudio();
    setAudioState('stopped');
  };

  const handleListenNow = () => {
    setShowListenPrompt(false);
    startPlayback();
  };
  
  const handleReadOnly = () => {
    setShowListenPrompt(false);
  };

  const getButtonIcon = () => {
    return audioState === 'playing' ? <PauseIcon className="w-5 h-5" /> : <SpeakerIcon className="w-5 h-5" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl shadow-purple-500/20 border border-white/10 animate-fade-in">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">
            Your Dream's Reflection
          </h2>
          <div className="flex items-center gap-2">
            {(audioState !== 'idle' && audioState !== 'stopped') && (
              <>
                <button
                  onClick={handlePlayPause}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                  aria-label={audioState === 'playing' ? 'Pause' : 'Play'}
                >
                  {getButtonIcon()}
                </button>
                <button
                  onClick={handleStop}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                  aria-label="Stop"
                >
                  <StopCircleIcon className="w-5 h-5" />
                </button>
              </>
            )}
             <button
                onClick={onReset}
                className="group relative inline-flex items-center justify-center px-6 py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-slate-600 active:scale-95"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Dream Again
            </button>
          </div>
        </div>
        
        {showListenPrompt ? (
          <div className="my-8 p-6 text-center bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200">Let the narrator guide you.</h3>
            <p className="mt-2 text-slate-400">Would you like to listen to the interpretation?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button onClick={handleListenNow} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors">Listen Now</button>
              <button onClick={handleReadOnly} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors">Read Only</button>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed whitespace-pre-wrap mt-4">
            <p>{displayedText}{displayedText.length < text.length && <span className="inline-block w-2 h-5 bg-pink-400 animate-pulse ml-1"></span>}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterpretationPage;
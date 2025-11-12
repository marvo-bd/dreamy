import React, { useState, useEffect, useRef } from 'react';
import { SparkleIcon } from './icons/SparkleIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';

// Fix for missing SpeechRecognition types in some TypeScript environments.
// These interfaces are based on the Web Speech API standard.
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface DreamInputProps {
  dream: string;
  setDream: (dream: string) => void;
  onInterpret: () => void;
  isLoading: boolean;
}

const DreamInput: React.FC<DreamInputProps> = ({ dream, setDream, onInterpret, isLoading }) => {
  const [isListening, setIsListening] = useState(false);
  const [isApiSupported, setIsApiSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      setIsApiSupported(true);
      const recognition: SpeechRecognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setDream(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsApiSupported(false);
      console.log('Speech Recognition API not supported in this browser.');
    }
  }, [setDream]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setDream(''); // Clear previous text for a fresh dictation
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  const getPlaceholderText = () => {
    if (isListening) return "Listening... speak your dream.";
    if (isApiSupported) return "Describe your dream, or use the microphone to dictate...";
    return "Describe your dream here... the more detail, the better the interpretation.";
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder={getPlaceholderText()}
        rows={6}
        className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-slate-300 placeholder-slate-500 disabled:opacity-50"
        disabled={isLoading}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={onInterpret}
          disabled={isLoading || !dream.trim()}
          className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex-grow"
        >
          <span className="absolute top-0 left-0 w-full h-full bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
          <SparkleIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
          {isLoading ? 'Interpreting...' : 'Interpret My Dream'}
        </button>
        {isApiSupported && (
          <button
            onClick={handleToggleListening}
            disabled={isLoading}
            className={`relative inline-flex items-center justify-center p-3 w-12 h-12 rounded-full transition-all duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
          >
            {isListening 
              ? <StopCircleIcon className="w-6 h-6" />
              : <MicrophoneIcon className="w-6 h-6" />
            }
          </button>
        )}
      </div>
      {isListening && (
        <div className="text-center -mt-2">
          <p className="text-purple-300 animate-pulse tracking-wider text-sm">Listening...</p>
        </div>
      )}
    </div>
  );
};

export default DreamInput;
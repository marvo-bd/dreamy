import React from 'react';
import DreamInput from '../DreamInput';
import { Logo } from '../icons/Logo';

interface InputPageProps {
  dream: string;
  setDream: (dream: string) => void;
  onInterpret: () => void;
  error: string | null;
}

const InputPage: React.FC<InputPageProps> = ({ dream, setDream, onInterpret, error }) => {
  return (
    <div className="w-full max-w-3xl mx-auto backdrop-blur-sm bg-black/30 rounded-2xl shadow-2xl shadow-purple-500/10 border border-white/10 transition-all duration-500 animate-fade-in">
      <header className="p-6 text-center border-b border-white/10 flex flex-col items-center gap-4">
        <Logo className="w-20 h-20" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Dreamy
        </h1>
        <p className="mt-2 text-md text-slate-400">
          Unveil the secrets hidden in your slumber.
        </p>
      </header>
      <div className="p-6 sm:p-8">
        <DreamInput
          dream={dream}
          setDream={setDream}
          onInterpret={onInterpret}
          isLoading={false} // Loading state is now handled by the page transition
        />
        {error && (
          <div className="mt-6 p-4 text-center text-red-300 bg-red-900/50 border border-red-500/30 rounded-lg">
            {error}
          </div>
        )}
      </div>
      <footer className="p-4 text-center text-slate-500 text-xs border-t border-white/10">
        <p>Powered by AI. Interpretations are for entertainment purposes only.</p>
      </footer>
    </div>
  );
};

export default InputPage;

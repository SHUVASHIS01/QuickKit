"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Keyboard,
  RotateCcw,
  Trophy,
  Gauge,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock
} from "lucide-react";

const WORD_BANK = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I",
  "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "his", "from",
  "they", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their",
  "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make",
  "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your",
  "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first",
  "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

function shuffleWords(count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  }
  return result;
}

export function TypingSpeedTest() {
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [words, setWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  // Keystroke statistics
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [wrongChars, setWrongChars] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);

  const resetTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setWords(shuffleWords(100));
    setCurrentWordIdx(0);
    setCurrentInput("");
    setHistory([]);
    setCorrectChars(0);
    setWrongChars(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [duration]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!isActive && !isFinished) {
      setIsActive(true);
    }

    // Space key moves to next word
    if (val.endsWith(" ")) {
      const typedWord = val.trim();
      const targetWord = words[currentWordIdx];

      let wordCorrect = 0;
      let wordWrong = 0;
      for (let i = 0; i < targetWord.length; i++) {
        if (typedWord[i] === targetWord[i]) {
          wordCorrect++;
        } else {
          wordWrong++;
        }
      }
      if (typedWord.length > targetWord.length) {
        wordWrong += typedWord.length - targetWord.length;
      }

      setCorrectChars((c) => c + wordCorrect + 1); // +1 for the correct space
      setWrongChars((w) => w + wordWrong);
      setHistory((prev) => [...prev, typedWord]);
      setCurrentWordIdx((i) => i + 1);
      setCurrentInput("");
      return;
    }

    setCurrentInput(val);
  };

  // Metric calculations
  const totalTyped = correctChars + wrongChars;
  const elapsedSeconds = duration - timeLeft;
  const minutes = Math.max(elapsedSeconds, 1) / 60;
  const rawWpm = Math.round(totalTyped / 5 / minutes);
  const netWpm = Math.max(0, Math.round(correctChars / 5 / minutes));
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* Top Controls Toolbar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" /> Duration:
          </span>
          {([15, 30, 60] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDuration(d);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                duration === d
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
            <span className="font-mono text-xl font-bold text-blue-600">{timeLeft}s</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">WPM</span>
            <span className="font-mono text-xl font-bold text-slate-800">{netWpm}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
            <span className="font-mono text-xl font-bold text-emerald-600">{accuracy}%</span>
          </div>
          <button
            onClick={resetTest}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 shadow-2xs transition-colors"
            title="Restart Test"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Typing Area or Finished Screen */}
      {!isFinished ? (
        <div
          onClick={() => inputRef.current?.focus()}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm cursor-text relative overflow-hidden min-h-[260px] flex flex-col justify-center"
        >
          {/* Hidden input catching keystrokes */}
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            className="opacity-0 absolute top-0 left-0 h-full w-full cursor-default"
            autoFocus
          />

          {/* Render word stream */}
          <div
            ref={wordsContainerRef}
            className="flex flex-wrap gap-x-3 gap-y-3 font-mono text-lg sm:text-2xl leading-relaxed select-none tracking-wide"
          >
            {words.slice(0, 40).map((word, wIdx) => {
              const isCurrent = wIdx === currentWordIdx;
              const isPast = wIdx < currentWordIdx;
              const pastWord = history[wIdx];

              if (isPast) {
                const isCorrect = pastWord === word;
                return (
                  <span
                    key={wIdx}
                    className={isCorrect ? "text-slate-400" : "text-rose-500 line-through decoration-2"}
                  >
                    {word}
                  </span>
                );
              }

              if (isCurrent) {
                return (
                  <span
                    key={wIdx}
                    className="relative bg-blue-50/80 px-1 rounded-md text-slate-900 font-semibold"
                  >
                    {word.split("").map((char, cIdx) => {
                      const typedChar = currentInput[cIdx];
                      let colorClass = "text-slate-400";
                      if (typedChar !== undefined) {
                        colorClass = typedChar === char ? "text-emerald-600" : "text-rose-600 bg-rose-100 rounded";
                      }
                      return (
                        <span key={cIdx} className={colorClass}>
                          {char}
                        </span>
                      );
                    })}
                    {/* Overflow wrong letters */}
                    {currentInput.length > word.length && (
                      <span className="text-rose-600 bg-rose-100 rounded">
                        {currentInput.slice(word.length)}
                      </span>
                    )}
                  </span>
                );
              }

              return (
                <span key={wIdx} className="text-slate-400">
                  {word}
                </span>
              );
            })}
          </div>

          {!isActive && (
            <p className="mt-8 text-center text-xs font-semibold uppercase tracking-wider text-blue-600 animate-pulse">
              Click anywhere and start typing to begin the {duration}s test...
            </p>
          )}
        </div>
      ) : (
        /* Finished Results Scorecard */
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shadow-2xs mb-4">
            <Trophy className="h-8 w-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Test Completed!
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here is your typing performance report</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="text-xs text-slate-500 block">Net WPM</span>
              <span className="text-3xl font-extrabold font-mono text-blue-700">{netWpm}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-xs text-slate-500 block">Accuracy</span>
              <span className="text-3xl font-extrabold font-mono text-emerald-700">{accuracy}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <span className="text-xs text-slate-500 block">Raw WPM</span>
              <span className="text-3xl font-extrabold font-mono text-purple-700">{rawWpm}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Keystrokes</span>
              <span className="text-3xl font-extrabold font-mono text-slate-800">
                {totalTyped}
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={resetTest}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all"
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

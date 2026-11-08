'use client';

import React, { useState } from 'react';
import { TriviaQuestion } from '@/types/wedding';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface CoupleTriviaProps {
  questions: TriviaQuestion[];
  coupleTitle: string;
}

export const CoupleTrivia: React.FC<CoupleTriviaProps> = ({ questions }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentQIndex];
  const userSelected = selectedAnswers[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (userSelected !== undefined) return;

    const updated = { ...selectedAnswers, [currentQIndex]: idx };
    setSelectedAnswers(updated);
    setShowExplanation(true);

    if (idx === currentQ.correctIndex) {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FAF4E3', '#9B1C2E', '#F39C12'],
      });
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, chosenIdx]) => {
    return questions[Number(qIdx)]?.correctIndex === chosenIdx ? acc + 1 : acc;
  }, 0);

  return (
    <div className="relative max-w-lg mx-auto bg-[#FDFBF7] paper-deckle rounded-2xl p-6 sm:p-8 shadow-[0_15px_45px_rgba(180,140,70,0.14)]">
      <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3 mb-4">
        <span className="font-cinzel text-[10px] tracking-widest uppercase text-[#AA820A] font-bold flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
          Couple Trivia & Banter
        </span>
        {!isFinished && (
          <span className="font-mono text-xs text-[#7D5F04]">
            Q {currentQIndex + 1} of {questions.length}
          </span>
        )}
      </div>

      {!isFinished ? (
        <div className="space-y-4">
          <h4 className="font-serif text-lg sm:text-xl font-medium text-[#2C2218]">
            {currentQ.question}
          </h4>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((option, idx) => {
              const isChosen = userSelected === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-[#FAF8F5] border-[#E8DFC8] text-[#3D2F22] hover:border-[#D4AF37] hover:bg-[#FAF4E3]/60';
              if (userSelected !== undefined) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  btnStyle = 'bg-[#FAF8F5]/60 border-neutral-200 text-neutral-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={userSelected !== undefined}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-sans flex items-center justify-between shadow-sm ${btnStyle}`}
                >
                  <span>{option}</span>
                  {userSelected !== undefined && (
                    <>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                      {isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="p-3.5 rounded-xl bg-[#FAF4E3] border border-[#D4AF37]/50 text-xs font-sans text-[#543F02] space-y-2.5 animate-fade-in">
              <p className="font-cormorant italic text-sm text-[#332601]">
                💡 {currentQ.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-cinzel text-xs uppercase font-bold hover:brightness-110 shadow-sm"
              >
                {currentQIndex + 1 < questions.length ? 'Next Question →' : 'See Final Score 🏆'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="text-center py-6 space-y-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-[#FAF4E3] border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#7D5F04]">
            <Trophy className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-2xl font-bold text-[#2C2218]">
            You Scored {score} / {questions.length}!
          </h4>
          <p className="font-cormorant italic text-sm text-[#544230] max-w-xs mx-auto">
            {score === questions.length
              ? 'Outstanding! You know the couple inside out. Special family blessing seat reserved for you at Udaivilas!'
              : 'Splendid attempt! Get ready to dance and celebrate in Udaipur!'}
          </p>
          <button
            onClick={() => {
              setCurrentQIndex(0);
              setSelectedAnswers({});
              setShowExplanation(false);
              setIsFinished(false);
            }}
            className="px-5 py-2 rounded-xl bg-[#FAF4E3] border border-[#D4AF37]/50 text-[#7D5F04] hover:bg-[#F3E5AB] text-xs font-cinzel uppercase tracking-wider font-semibold transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

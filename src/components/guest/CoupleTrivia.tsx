'use client';

import React, { useState } from 'react';
import { TriviaQuestion } from '@/types/wedding';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { InvitationLanguage } from '@/lib/invitationI18n';

interface CoupleTriviaProps {
  questions?: TriviaQuestion[];
  coupleTitle?: string;
  coupleNames?: string;
  language?: InvitationLanguage;
}

const defaultTriviaQuestions: TriviaQuestion[] = [
  {
    id: 'tr-1',
    question: 'Who confessed their love first?',
    options: ['Groom', 'Bride', 'Both at the exact same sunset!', 'Still debating!'],
    correctIndex: 2,
    explanation: 'They spoke the words at the exact same second while watching the sunset together!',
  },
  {
    id: 'tr-2',
    question: 'What is their all-time favorite dish to cook together?',
    options: ['Butter Chicken', 'Spicy Truffle Pasta', 'Sunday Slow-Cooked Rajma Chawal with Ghee', 'Woodfired Sourdough Pizza'],
    correctIndex: 2,
    explanation: 'Sunday slow-simmered Rajma Chawal with ghee is sacred!',
  },
  {
    id: 'tr-3',
    question: 'Where was their first spontaneous vacation together?',
    options: ['Udaipur Lake Palaces', 'Old Town Goa Beaches', 'Ladakh Mountain Expedition', 'Manali Snow Cabins'],
    correctIndex: 1,
    explanation: 'A spontaneous road trip to North Goa quiet beaches!',
  },
];

export const CoupleTrivia: React.FC<CoupleTriviaProps> = ({
  questions = defaultTriviaQuestions,
  coupleTitle,
  coupleNames,
  language = 'en',
}) => {
  const effectiveQuestions = questions && questions.length > 0 ? questions : defaultTriviaQuestions;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = effectiveQuestions[currentQIndex];
  const userSelected = selectedAnswers[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (userSelected !== undefined) return;
    const isCorrect = index === currentQ.correctIndex;
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: index }));
    setShowExplanation(true);

    if (isCorrect) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#9B1C2E', '#FAF8F5'],
      });
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQIndex + 1 < effectiveQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FAF4E3', '#9B1C2E'],
      });
    }
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, chosenIdx]) => {
    const q = effectiveQuestions[Number(qIdx)];
    return acc + (q && chosenIdx === q.correctIndex ? 1 : 0);
  }, 0);

  return (
    <div className="relative max-w-xl mx-auto border border-[#D4AF37]/60 bg-transparent p-6 sm:p-8">
      {/* Traditional Indian Corner Filigrees */}
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3 mb-4">
        <span className="font-cinzel text-xs tracking-widest uppercase text-[#7A1423] font-bold flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#AA820A]" />
          {coupleTitle || coupleNames || (language === 'en' ? 'Couple Trivia & Banter' : 'हँसी-खुशी प्रश्नोत्तरी')}
        </span>
        {!isFinished && (
          <span className="font-serif text-xs text-[#7D5F04] font-semibold">
            {language === 'en' ? `Question ${currentQIndex + 1} of ${effectiveQuestions.length}` : `प्रश्न ${currentQIndex + 1} / ${effectiveQuestions.length}`}
          </span>
        )}
      </div>

      {!isFinished ? (
        <div className="space-y-4">
          <h4 className="font-serif text-base sm:text-lg font-bold text-[#2C1810]">
            {currentQ.question}
          </h4>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isChosen = userSelected === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'border-[#D4AF37]/50 text-[#3D2817] hover:border-[#7A1423] hover:bg-[#FAF4E3]/40';
              if (userSelected !== undefined) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-bold';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'border-rose-600 bg-rose-50/60 text-rose-950';
                } else {
                  btnStyle = 'border-neutral-300/60 text-neutral-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={userSelected !== undefined}
                  className={`w-full text-left p-3.5 border transition-all text-sm font-serif flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{option}</span>
                  {userSelected !== undefined && (
                    <>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />}
                      {isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-700 shrink-0 ml-2" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="p-4 border border-[#D4AF37]/60 text-xs font-serif text-[#4A321E] space-y-3 animate-fade-in bg-[#FAF5E8]/60">
              <p className="font-cormorant italic text-sm text-[#332601]">
                💡 {currentQ.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#9B1C2E] to-[#7A1423] text-white font-serif text-xs uppercase font-bold tracking-wider hover:brightness-110 cursor-pointer border border-[#D4AF37]"
              >
                {currentQIndex + 1 < effectiveQuestions.length
                  ? (language === 'en' ? 'Next Question →' : 'अगला प्रश्न →')
                  : (language === 'en' ? 'See Final Score 🏆' : 'अंतिम परिणाम देखें 🏆')}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="text-center py-6 space-y-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#7A1423]">
            <Trophy className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-2xl font-bold text-[#2C2218]">
            {language === 'en' ? `You Scored ${score} / ${effectiveQuestions.length}!` : `आपका स्कोर: ${score} / ${effectiveQuestions.length}!`}
          </h4>
          <p className="font-cormorant italic text-base text-[#544230] max-w-sm mx-auto">
            {score === questions.length
              ? (language === 'en'
                  ? 'Outstanding! You know the couple inside out. Special family blessing seat reserved for you!'
                  : 'अद्भुत! आप वर-वधू को अत्यंत गहराई से जानते हैं। आपके लिए विवाह में विशेष स्थान आरक्षित है!')
              : (language === 'en'
                  ? 'Splendid attempt! Get ready to dance and celebrate with Rohit & Priya!'
                  : 'शानदार प्रयास! विवाह समारोह में खूब नाचने और उत्सव मनाने हेतु तैयार रहें!')}
          </p>
          <button
            onClick={() => {
              setCurrentQIndex(0);
              setSelectedAnswers({});
              setShowExplanation(false);
              setIsFinished(false);
            }}
            className="px-6 py-2 rounded-full border border-[#D4AF37] text-[#7A1423] hover:bg-[#FAF4E3] text-xs font-serif uppercase tracking-wider font-bold transition-colors cursor-pointer"
          >
            {language === 'en' ? 'Play Again' : 'पुनः खेलें'}
          </button>
        </div>
      )}
    </div>
  );
};

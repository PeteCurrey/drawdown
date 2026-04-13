"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
  Target,
  Zap,
} from "lucide-react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizEngineProps {
  questions: QuizQuestion[];
  moduleKey: string;
  onComplete?: (score: number, total: number) => void;
}

type QuizState = "active" | "review" | "complete";

export function QuizEngine({ questions, moduleKey, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [revealed, setRevealed] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>("active");

  const current = questions[currentIndex];
  const isCorrect = selectedAnswer === current?.correctIndex;
  const score = answers.reduce<number>(
    (acc, ans, i) => (ans === questions[i].correctIndex ? acc + 1 : acc),
    0
  );
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  const handleSelect = useCallback(
    (index: number) => {
      if (revealed) return;
      setSelectedAnswer(index);
    },
    [revealed]
  );

  const handleConfirm = useCallback(() => {
    if (selectedAnswer === null) return;
    setRevealed(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
  }, [selectedAnswer, answers, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setRevealed(false);
    } else {
      setQuizState("complete");
      onComplete?.(score, questions.length);
    }
  }, [currentIndex, questions.length, onComplete, score]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers(new Array(questions.length).fill(null));
    setRevealed(false);
    setQuizState("active");
  }, [questions.length]);

  if (quizState === "complete") {
    return (
      <div className="max-w-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-12 bg-background-surface border border-border-slate text-center space-y-8">
          <div
            className={cn(
              "w-24 h-24 mx-auto rounded-full flex items-center justify-center",
              passed
                ? "bg-profit/10 border-2 border-profit"
                : "bg-loss/10 border-2 border-loss"
            )}
          >
            {passed ? (
              <Trophy className="w-10 h-10 text-profit" />
            ) : (
              <Target className="w-10 h-10 text-loss" />
            )}
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">
              Quiz Complete
            </p>
            <h3 className="text-4xl font-display font-black uppercase">
              {score}/{questions.length}
            </h3>
            <p
              className={cn(
                "text-lg font-display font-bold uppercase mt-2",
                passed ? "text-profit" : "text-loss"
              )}
            >
              {percentage}% — {passed ? "Passed" : "Not Yet"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-8 border-t border-border-slate/50">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="flex items-center gap-4 py-3 border-b border-border-slate/20"
              >
                {answers[i] === q.correctIndex ? (
                  <CheckCircle2 className="w-4 h-4 text-profit shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-loss shrink-0" />
                )}
                <p className="text-xs text-text-secondary text-left truncate flex-grow">
                  {q.question}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            {!passed && (
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-8 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all"
              >
                <RotateCcw className="w-3 h-3" /> Retry Quiz
              </button>
            )}
            {passed && (
              <div className="flex items-center gap-2 px-8 py-4 bg-profit/10 border border-profit/20 text-profit text-[10px] font-bold uppercase tracking-widest">
                <Zap className="w-3 h-3" /> Module Unlocked
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-6 h-1 transition-all",
                  i < currentIndex
                    ? answers[i] === questions[i].correctIndex
                      ? "bg-profit"
                      : "bg-loss"
                    : i === currentIndex
                    ? "bg-accent"
                    : "bg-border-slate"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 bg-background-surface border border-border-slate">
        <h3 className="text-xl font-display font-bold uppercase mb-8 leading-tight">
          {current.question}
        </h3>
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            let borderColor = "border-border-slate hover:border-text-tertiary";
            let bgColor = "";
            let textColor = "";

            if (revealed) {
              if (i === current.correctIndex) {
                borderColor = "border-profit";
                bgColor = "bg-profit/5";
                textColor = "text-profit";
              } else if (i === selectedAnswer) {
                borderColor = "border-loss";
                bgColor = "bg-loss/5";
                textColor = "text-loss";
              } else {
                borderColor = "border-border-slate opacity-40";
              }
            } else if (i === selectedAnswer) {
              borderColor = "border-accent";
              bgColor = "bg-accent/5";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={cn(
                  "w-full text-left p-5 border transition-all flex items-center gap-4",
                  borderColor,
                  bgColor
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 border flex items-center justify-center font-mono text-xs shrink-0",
                    i === selectedAnswer && !revealed
                      ? "border-accent text-accent"
                      : revealed && i === current.correctIndex
                      ? "border-profit text-profit bg-profit/10"
                      : revealed && i === selectedAnswer
                      ? "border-loss text-loss bg-loss/10"
                      : "border-border-slate text-text-tertiary"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  className={cn(
                    "text-sm font-mono uppercase tracking-widest",
                    textColor
                  )}
                >
                  {opt}
                </span>
                {revealed && i === current.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-profit ml-auto shrink-0" />
                )}
                {revealed && i === selectedAnswer && i !== current.correctIndex && (
                  <XCircle className="w-4 h-4 text-loss ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {revealed && (
        <div
          className={cn(
            "p-6 border-l-4 animate-in slide-in-from-bottom-2 duration-300",
            isCorrect
              ? "border-profit bg-profit/5"
              : "border-loss bg-loss/5"
          )}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2">
            {isCorrect ? "✓ Correct" : "✗ Incorrect"}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {current.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {!revealed ? (
          <button
            onClick={handleConfirm}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirm Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "View Results"}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

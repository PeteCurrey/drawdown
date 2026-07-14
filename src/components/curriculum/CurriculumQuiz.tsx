"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface Props {
  phaseSlug: string;
  moduleNumber: number;
  questions: QuizQuestion[];
  nextModuleUrl: string | null;
}

export function CurriculumQuiz({ phaseSlug, moduleNumber, questions, nextModuleUrl }: Props) {
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const hasAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correct_index;

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    if (idx === currentQ.correct_index) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleMarkComplete = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 75;

    try {
      const res = await fetch("/api/curriculum/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase_slug: phaseSlug,
          module_number: moduleNumber,
          quiz_score: pct,
          quiz_passed: passed
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to update progress");

      if (data.certificateIssued) {
        setSuccessMessage("Phase Complete! Certificate Issued.");
        setTimeout(() => {
          router.push(`/dashboard/curriculum/certificate/${phaseSlug}`);
        }, 2000);
      } else if (nextModuleUrl) {
        setSuccessMessage("Module Complete! Loading next...");
        setTimeout(() => {
          router.push(nextModuleUrl);
        }, 2000);
      } else {
        setSuccessMessage("Phase Complete!");
        setTimeout(() => {
          router.push("/dashboard/curriculum");
        }, 2000);
      }
      
    } catch (err: any) {
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 75;

    return (
      <div className="bg-[#111111] border border-[#222] rounded-xl p-8 text-center mt-12 animate-in fade-in zoom-in-95 duration-300">
        <h3 className="text-2xl font-bold font-syne text-white mb-2">Quiz Results</h3>
        <p className="text-4xl font-mono font-bold text-accent mb-6">{pct}%</p>
        
        {passed ? (
          <div className="space-y-6">
            <p className="text-text-secondary">Excellent work. You have passed the module quiz.</p>
            {submitError && <p className="text-loss text-sm">{submitError}</p>}
            {successMessage && <p className="text-profit font-bold animate-pulse">{successMessage}</p>}
            
            <button
              onClick={handleMarkComplete}
              disabled={isSubmitting || !!successMessage}
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent hover:bg-[#b5e02b] text-black font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {isSubmitting ? "Saving..." : "Mark Complete"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-text-secondary">You need 75% or higher to pass this module.</p>
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-8 py-3 bg-background-surface hover:bg-[#222] text-white border border-[#333] font-bold uppercase tracking-widest rounded transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-[#222] rounded-xl p-6 md:p-8 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold font-syne text-white">Module Knowledge Check</h3>
        <span className="text-xs font-mono text-text-tertiary uppercase tracking-widest">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <p className="text-text-primary text-lg mb-8">{currentQ.question}</p>

      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAns = idx === currentQ.correct_index;
          
          let btnClass = "bg-background-surface border-[#333] hover:border-[#555] text-text-secondary";
          
          if (hasAnswered) {
            if (isCorrectAns) btnClass = "bg-[#16a34a]/10 border-[#16a34a] text-[#16a34a]";
            else if (isSelected) btnClass = "bg-[#dc2626]/10 border-[#dc2626] text-[#dc2626]";
            else btnClass = "bg-background-surface border-[#222] text-[#555] opacity-50";
          } else if (isSelected) {
            btnClass = "border-accent text-accent";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${btnClass} flex items-center justify-between`}
            >
              <span>{opt}</span>
              {hasAnswered && isCorrectAns && <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />}
              {hasAnswered && isSelected && !isCorrectAns && <XCircle className="w-5 h-5 text-[#dc2626]" />}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className="mt-8 p-4 bg-[#1A1A1A] rounded-lg border border-[#333] animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-[#16a34a] shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-[#dc2626] shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-bold mb-1 ${isCorrect ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm text-text-secondary">{currentQ.explanation}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-white text-black font-bold uppercase tracking-widest text-xs rounded transition-opacity hover:opacity-90"
            >
              {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

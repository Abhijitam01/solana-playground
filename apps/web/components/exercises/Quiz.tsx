"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

interface QuizProps {
  content: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      explanation?: string;
    }>;
  };
  solution: Record<string, number>; // questionId -> optionIndex
  onComplete: (correct: boolean) => void;
}

export function Quiz({ content, solution, onComplete }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    content.questions.forEach((question) => {
      if (answers[question.id] === solution[question.id]) {
        correct++;
      }
    });
    setScore(correct);
    onComplete(correct === content.questions.length);
  };

  const allAnswered = content.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {content.questions.map((question, qIndex) => {
        const selectedAnswer = answers[question.id];
        const correctAnswer = solution[question.id];
        const isCorrect = submitted && selectedAnswer === correctAnswer;
        const isWrong = submitted && selectedAnswer !== correctAnswer && selectedAnswer !== undefined;

        return (
          <div key={question.id} className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-foreground">
                {qIndex + 1}. {question.question}
              </span>
              {submitted && isCorrect && (
                <Badge variant="success" size="sm">Correct</Badge>
              )}
              {submitted && isWrong && (
                <Badge variant="destructive" size="sm">Incorrect</Badge>
              )}
            </div>

            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isCorrectOption = submitted && optionIndex === correctAnswer;

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(question.id, optionIndex)}
                    disabled={submitted}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-fast ${
                      submitted && isCorrectOption
                        ? "bg-success-light border-success"
                        : isSelected && !submitted
                        ? "bg-primary-light border-primary"
                        : isSelected && submitted && isWrong
                        ? "bg-destructive-light border-destructive"
                        : "bg-muted/30 border-border hover:bg-muted/50"
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-2">
                      {submitted && isCorrectOption ? (
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      ) : (
                        <Circle
                          className={`w-4 h-4 flex-shrink-0 ${
                            isSelected ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      )}
                      <span className="text-sm text-foreground">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {submitted && question.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-lg bg-info-light border border-info"
              >
                <div className="text-xs font-semibold text-info mb-1">Explanation:</div>
                <div className="text-sm text-foreground">{question.explanation}</div>
              </motion.div>
            )}
          </div>
        );
      })}

      <button
        onClick={handleSubmit}
        disabled={submitted || !allAnswered}
        className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4" />
        {submitted ? `Score: ${score}/${content.questions.length}` : "Submit Quiz"}
      </button>
    </div>
  );
}


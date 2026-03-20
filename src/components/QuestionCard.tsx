"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, FormAnswers } from "@/types";

interface QuestionCardProps {
  question: Question;
  answer: string | string[] | File[] | null;
  onAnswer: (value: string | string[] | File[] | null) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSubmit: () => void;
}

export default function QuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onSubmit,
}: QuestionCardProps) {
  const [linkInputs, setLinkInputs] = useState<string[]>(
    Array.isArray(answer) && answer.length > 0 && typeof answer[0] === "string"
      ? (answer as string[])
      : [""]
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAnswered = () => {
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return (answer as string).trim().length > 0;
  };

  const canProceed = !question.required || isAnswered();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && canProceed) {
      e.preventDefault();
      if (isLast) onSubmit();
      else onNext();
    }
  };

  const handleMultiSelect = (value: string) => {
    const current = (answer as string[]) || [];
    if (current.includes(value)) {
      onAnswer(current.filter((v) => v !== value));
    } else {
      onAnswer([...current, value]);
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    const updated = [...linkInputs];
    updated[index] = value;
    setLinkInputs(updated);
    onAnswer(updated.filter((l) => l.trim()));
  };

  const addLink = () => {
    setLinkInputs([...linkInputs, ""]);
  };

  const removeLink = (index: number) => {
    const updated = linkInputs.filter((_, i) => i !== index);
    setLinkInputs(updated.length ? updated : [""]);
    onAnswer(updated.filter((l) => l.trim()));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onAnswer(Array.from(files));
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case "text":
      case "email":
      case "phone":
      case "url":
        return (
          <input
            type={question.type === "phone" ? "tel" : question.type}
            value={(answer as string) || ""}
            onChange={(e) => onAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder}
            className="w-full bg-transparent border-b-2 border-border focus:border-accent text-xl sm:text-2xl py-3 outline-none transition-colors placeholder:text-muted/30"
            autoFocus
          />
        );

      case "textarea":
        return (
          <textarea
            value={(answer as string) || ""}
            onChange={(e) => onAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder}
            rows={4}
            className="w-full bg-surface border border-border rounded-xl text-lg p-4 outline-none focus:border-accent transition-colors placeholder:text-muted/30 resize-none"
            autoFocus
          />
        );

      case "select":
        return (
          <div className="flex flex-col gap-3">
            {question.options?.map((opt) => (
              <motion.button
                key={opt.value}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  onAnswer(opt.value);
                  if (!isLast) {
                    setTimeout(onNext, 300);
                  }
                }}
                className={`text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 text-base sm:text-lg ${
                  answer === opt.value
                    ? "border-accent bg-accent/5 text-foreground font-medium"
                    : "border-border hover:border-accent/30 text-foreground/80"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      answer === opt.value
                        ? "border-accent bg-accent"
                        : "border-border"
                    }`}
                  >
                    {answer === opt.value && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="white"
                      >
                        <circle cx="5" cy="5" r="3" />
                      </motion.svg>
                    )}
                  </span>
                  {opt.label}
                </span>
              </motion.button>
            ))}
          </div>
        );

      case "multiselect":
        return (
          <div className="flex flex-wrap gap-3">
            {question.options?.map((opt) => {
              const selected = ((answer as string[]) || []).includes(opt.value);
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMultiSelect(opt.value)}
                  className={`px-5 py-3 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base ${
                    selected
                      ? "border-accent bg-accent text-white font-medium"
                      : "border-border hover:border-accent/30 text-foreground/80"
                  }`}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        );

      case "file":
        return (
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent/30 transition-colors"
            >
              <div className="text-muted/40 text-4xl mb-2">+</div>
              <p className="text-muted text-sm">
                Click to upload or drag files here
              </p>
              <p className="text-muted/50 text-xs mt-1">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            {answer && Array.isArray(answer) && answer[0] instanceof File && (
              <div className="space-y-2">
                {(answer as File[]).map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted bg-surface rounded-lg px-3 py-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 1h5l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "links":
        return (
          <div className="space-y-3">
            {linkInputs.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(i, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={question.placeholder}
                  className="flex-1 bg-transparent border-b-2 border-border focus:border-accent text-lg py-2 outline-none transition-colors placeholder:text-muted/30"
                  autoFocus={i === 0}
                />
                {linkInputs.length > 1 && (
                  <button
                    onClick={() => removeLink(i)}
                    className="text-muted/40 hover:text-error transition-colors p-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M5 5l8 8M13 5l-8 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addLink}
              className="text-sm text-accent hover:text-accent-light transition-colors font-medium"
            >
              + Add another link
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground leading-snug mb-2">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-base text-muted leading-relaxed">
            {question.subtitle}
          </p>
        )}
      </div>

      <div className="mb-10">{renderInput()}</div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPrev}
          className="text-sm text-muted hover:text-foreground transition-colors font-medium flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4L6 8l4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-3">
          {!question.required && !isAnswered() && (
            <button
              onClick={isLast ? onSubmit : onNext}
              className="text-sm text-muted hover:text-foreground transition-colors font-medium"
            >
              Skip
            </button>
          )}
          <motion.button
            onClick={isLast ? onSubmit : onNext}
            disabled={!canProceed}
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              canProceed
                ? "bg-accent hover:bg-accent-light text-white shadow-md shadow-accent/10"
                : "bg-border text-muted/40 cursor-not-allowed"
            }`}
          >
            {isLast ? "Submit" : "Continue"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

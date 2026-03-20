"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, X, Upload, FileText } from "lucide-react";

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
          <Input
            type={question.type === "phone" ? "tel" : question.type}
            value={(answer as string) || ""}
            onChange={(e) => onAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder}
            className="h-auto text-xl sm:text-2xl py-3 border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/30"
            autoFocus
          />
        );

      case "textarea":
        return (
          <Textarea
            value={(answer as string) || ""}
            onChange={(e) => onAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.placeholder}
            rows={4}
            className="text-lg p-4 resize-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/30"
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
                    ? "border-primary bg-primary/5 text-foreground font-medium"
                    : "border-border hover:border-primary/30 text-foreground/80"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      answer === opt.value
                        ? "border-primary bg-primary"
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
                      ? "border-primary bg-primary text-primary-foreground font-medium"
                      : "border-border hover:border-primary/30 text-foreground/80"
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
            <Card
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
            >
              <Upload className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground text-sm">
                Click to upload or drag files here
              </p>
              <p className="text-muted-foreground/50 text-xs mt-1">
                PNG, JPG, PDF up to 10MB
              </p>
            </Card>
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
                    className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2"
                  >
                    <FileText className="h-4 w-4" />
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
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(i, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={question.placeholder}
                  className="h-auto text-lg py-2 border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/30"
                  autoFocus={i === 0}
                />
                {linkInputs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(i)}
                    className="text-muted-foreground/40 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="link"
              onClick={addLink}
              className="text-primary p-0 h-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add another link
            </Button>
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
          <p className="text-base text-muted-foreground leading-relaxed">
            {question.subtitle}
          </p>
        )}
      </div>

      <div className="mb-10">{renderInput()}</div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onPrev}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          {!question.required && !isAnswered() && (
            <Button
              variant="ghost"
              onClick={isLast ? onSubmit : onNext}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
          )}
          <motion.div
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
          >
            <Button
              onClick={isLast ? onSubmit : onNext}
              disabled={!canProceed}
              className="shadow-md shadow-primary/10"
            >
              {isLast ? "Submit" : "Continue"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

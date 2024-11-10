"use client";
import { validateWord } from "@/app/actions";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  length?: number;
  inputValue: string;
  onChange: (otp: string) => void;
  correctWord: string;
  attempt: number;
  currentAttempt: number;
  setCurrentAttempt: React.Dispatch<React.SetStateAction<number>>;
  winGame: boolean | null;
  setWinGame: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const Input: React.FC<Props> = ({
  length = 5,
  inputValue,
  onChange,
  correctWord,
  currentAttempt,
  setCurrentAttempt,
  winGame,
  setWinGame,
  attempt,
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(""));
  const [feedbackColors, setFeedbackColors] = useState<string[]>(
    Array(length).fill("bg-gray-500/20")
  );
  const [shake, setShake] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z]?$/.test(value)) {
      const updatedOtpValues = [...otpValues];
      updatedOtpValues[index] = value.toUpperCase();
      setOtpValues(updatedOtpValues);
      onChange(updatedOtpValues.join(""));

      // Move to the next input if a character is entered
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Trigger verification on Enter
    if (event.key === "Enter" && otpValues.join("").length === length) {
      handleSubmit();
    }
  };

  // Função para aplicar cores baseadas nas regras de Wordle
  const handleSubmit = async () => {
    const lowerCorrectWord = correctWord.toLowerCase();

    if (lowerCorrectWord === inputValue.toLowerCase()) {
      setWinGame(true);
      setFeedbackColors(Array(length).fill("bg-green-500"));
      return;
    }

    setDisabled(true);
    const result = await validateWord(inputValue);

    if (!result?.valid) {
      toast.error(result?.message);
      setShake(true);
      setTimeout(() => setShake(false), 300);
      setDisabled(false);
      return;
    }

    setDisabled(false);

    const lowerOtpValues = otpValues.map((val) => val.toLowerCase());

    // Contar quantas vezes cada letra aparece na palavra correta
    const letterCounts: Record<string, number> = {};
    for (const char of lowerCorrectWord) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }

    // Verificar letras na posição correta (verde)
    const colors = Array(length).fill("bg-gray-500");
    lowerOtpValues.forEach((char, idx) => {
      if (char === lowerCorrectWord[idx]) {
        colors[idx] = "bg-green-500";
        letterCounts[char]--;
      }
    });

    // Verificar letras na posição incorreta (amarelo)
    lowerOtpValues.forEach((char, idx) => {
      if (
        colors[idx] !== "bg-green-500" && // Não já marcado como verde
        letterCounts[char] > 0
      ) {
        colors[idx] = "bg-yellow-500";
        letterCounts[char]--;
      }
    });

    if (currentAttempt === 5) {
      setWinGame(false);
    }
    setCurrentAttempt(currentAttempt + 1);
    setFeedbackColors(colors);
  };

  return (
    <div className="flex gap-3">
      {otpValues.map((value, index) => (
        <input
          disabled={currentAttempt !== attempt || !!winGame || disabled}
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
            return;
          }}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={cn(
            "w-20 h-20 text-center flex items-center justify-center rounded-md text-white outline-none border-none text-4xl font-extrabold uppercase",
            feedbackColors[index],
            shake && "shake"
          )}
        />
      ))}
    </div>
  );
};

export default Input;

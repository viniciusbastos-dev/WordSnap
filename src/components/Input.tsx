"use client";
import React, { useRef, useState } from "react";

interface Props {
  length?: number;
  inputValue: string;
  onChange: (otp: string) => void;
  correctWord: string;
}
const Input: React.FC<Props> = ({
  length = 5,
  inputValue,
  onChange,
  correctWord,
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z]?$/.test(value)) {
      const updatedOtpValues = [...otpValues];
      updatedOtpValues[index] = value.toUpperCase();
      setOtpValues(updatedOtpValues);
      onChange(updatedOtpValues.join(""));

      // Move to the next input if value is entered
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
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData("text").slice(0, length);
    const updatedOtpValues = pasteData
      .split("")
      .map((char, index) => (index < length ? char : ""));
    setOtpValues(updatedOtpValues);
    onChange(updatedOtpValues.join(""));

    // Focus on the last field of the pasted value
    const nextIndex = pasteData.length < length ? pasteData.length : length - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  // Função para aplicar cores baseadas nas regras de Wordle
  const getLetterClass = (letter: string, index: number) => {
    if (!letter || inputValue.length !== length) return "bg-gray-500/20"; // Nenhuma letra ainda, fundo cinza claro

    if (letter.toLowerCase() === correctWord[index].toLowerCase()) {
      return "bg-green-500"; // Letra e posição corretas
    } else if (correctWord.includes(letter)) {
      return "bg-yellow-500"; // Letra correta, mas posição errada
    } else {
      return "bg-gray-500"; // Letra incorreta
    }
  };

  return (
    <div className="flex gap-3">
      {otpValues.map((value, index) => (
        <input
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
          onPaste={handlePaste}
          className={`w-20 h-20 text-center flex items-center justify-center rounded-md text-white outline-none border-none text-4xl font-extrabold uppercase ${getLetterClass(
            value,
            index
          )}`} // Aplicando a cor correta
        />
      ))}
    </div>
  );
};

export default Input;

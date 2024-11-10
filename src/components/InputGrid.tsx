"use client";
import React, { useState } from "react";
import Input from "./Input";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";

interface Props {
  secretWord: string;
}

const Game: React.FC<Props> = ({ secretWord }) => {
  const inputsArr = Array(5).fill("");

  const [attempts, setAttempts] = useState<string[][]>(
    Array(5).fill(Array(5).fill(""))
  );
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [winGame, setWinGame] = useState<boolean | null>(null);

  const handleChange = (attemptIndex: number, otpCode: string) => {
    const updatedAttempts = [...attempts];
    updatedAttempts[attemptIndex] = otpCode.split("");
    setAttempts(updatedAttempts);
  };

  return (
    <>
      {winGame && (
        <div>
          <h1 className="text-3xl font-bold text-center">
            Parabéns, você ganhou!
          </h1>
        </div>
      )}

      {winGame === false && (
        <div>
          <h1 className="text-3xl font-bold text-center">
            Que pena, você perdeu
          </h1>
        </div>
      )}

      <div className="space-y-3">
        {inputsArr.map((_, index) => (
          <Input
            key={index}
            length={5}
            inputValue={attempts[index].join("")} // Passa o valor da tentativa atual
            onChange={(otpCode) => handleChange(index, otpCode)}
            correctWord={secretWord}
            currentAttempt={currentAttempt}
            attempt={index + 1}
            setCurrentAttempt={setCurrentAttempt}
            winGame={winGame}
            setWinGame={setWinGame}
          />
        ))}
      </div>
    </>
  );
};

export default Game;

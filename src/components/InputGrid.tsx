"use client";
import React, { useState } from "react";
import Input from "./Input";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

interface Props {
  secretWord: string;
}
const InputGrid: React.FC<Props> = ({ secretWord }) => {
  const [otp, setOtp] = useState("");

  useEffectAfterMount(() => {
    if (otp.length === 5) {
      validateWord();
    }
  }, [otp]);

  const validateWord = async () => {
    try {
      await axios.post("/api/word/validate", {
        word: otp,
      });
    } catch (error) {
      if (isAxiosError(error)) toast.error(error?.response?.data.message);
    }
  };
  return (
    <div className="space-y-3">
      <Input
        length={5}
        inputValue={otp}
        onChange={(otpCode) => setOtp(otpCode)}
        correctWord={secretWord}
      />
    </div>
  );
};

export default InputGrid;

"use client";
import axios, { isAxiosError } from "axios";
import Header from "@/components/Header";
import Input from "@/components/Input";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [otp, setOtp] = useState("");

  useEffectAfterMount(() => {
    if (otp.length === 5) {
      validateWord();
    }
  }, [otp]);

  const validateWord = async () => {
    try {
      await axios.post("http://localhost:3000/api/word/validate", {
        word: otp,
      });
    } catch (error) {
      if (isAxiosError(error)) toast.error(error?.response?.data.message);
    }
  };

  return (
    <main className="h-screen pt-20 flex flex-col items-center gap-20">
      <Header />
      <div className="space-y-3">
        <Input
          length={5}
          inputValue={otp}
          onChange={(otpCode) => setOtp(otpCode)}
          correctWord="APPLE"
        />
      </div>
    </main>
  );
}

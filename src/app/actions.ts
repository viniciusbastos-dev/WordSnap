"use server";

import axios, { AxiosError } from "axios";
import API from "../lib/axios-instance";

export const validateWord = async (word: string) => {
  try {
    const response = await API.post("/api/word/validate", {
      word,
    });

    return {
      valid: response?.data?.valid,
      message: response?.data?.message,
    };
  } catch (error: any) {
    return {
      valid: error?.response?.data?.valid,
      message: error?.response?.data?.message,
    };
  }
};
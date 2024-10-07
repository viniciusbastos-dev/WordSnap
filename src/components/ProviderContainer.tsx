"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: React.ReactNode;
}
const ProviderContainer: React.FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer position="top-center" />
    </>
  );
};

export default ProviderContainer;

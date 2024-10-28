// src/components/LoadingSpinner.js
import React from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen text-gray-700">
      <div className="loader">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    </div>
  );
};

export default LoadingSpinner;

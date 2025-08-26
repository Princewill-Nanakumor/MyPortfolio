"use client";
import React from "react";
import { HiCheck } from "react-icons/hi";

interface Step {
  number: number;
  title: string;
  component: string;
}

interface BlogPostProgressBarProps {
  steps: Step[];
  currentStep: number;
  isStepValid: (step: number) => boolean;
  goToStep: (stepNumber: number) => void;
}

const BlogPostProgressBar: React.FC<BlogPostProgressBarProps> = ({
  steps,
  currentStep,
  isStepValid,
  goToStep,
}) => {
  return (
    <div className="flex-shrink-0 p-3 border-b border-gray-200 sm:p-4 bg-gray-50">
      {/* Desktop Layout */}
      <div className="items-center justify-between hidden sm:flex">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <button
              onClick={() => goToStep(step.number)}
              disabled={step.number > currentStep}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                step.number < currentStep
                  ? "bg-green-500 text-white"
                  : step.number === currentStep
                    ? "bg-secondary-indigo text-white"
                    : "bg-gray-200 text-gray-500"
              } ${
                step.number <= currentStep
                  ? "hover:scale-105 cursor-pointer"
                  : "cursor-not-allowed"
              }`}
            >
              {step.number < currentStep ? (
                <HiCheck className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.number}</span>
              )}
            </button>
            <span
              className={`ml-2 text-sm font-medium ${
                step.number === currentStep
                  ? "text-secondary-indigo"
                  : step.number < currentStep
                    ? "text-green-600"
                    : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-4 transition-colors ${
                  step.number < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <button
                onClick={() => goToStep(step.number)}
                disabled={step.number > currentStep}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                  step.number < currentStep
                    ? "bg-green-500 text-white"
                    : step.number === currentStep
                      ? "bg-secondary-indigo text-white"
                      : "bg-gray-200 text-gray-500"
                } ${
                  step.number <= currentStep
                    ? "hover:scale-105 cursor-pointer"
                    : "cursor-not-allowed"
                }`}
              >
                {step.number < currentStep ? (
                  <HiCheck className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{step.number}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-colors ${
                    step.number < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Title */}
        <div className="text-center">
          <span className="text-sm font-medium text-secondary-indigo">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </span>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-1">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step.number === currentStep
                    ? "bg-secondary-indigo"
                    : step.number < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostProgressBar;

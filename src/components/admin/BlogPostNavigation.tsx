// src/components/admin/BlogPostNavigation.tsx
"use client";
import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface Step {
  number: number;
  title: string;
  component: string;
}

interface BlogPostNavigationProps {
  steps: Step[];
  currentStep: number;
  isStepValid: (step: number) => boolean;
  goToStep: (stepNumber: number) => void;
  prevStep: (e?: React.MouseEvent) => void;
  nextStep: (e?: React.MouseEvent) => void;
}

const BlogPostNavigation: React.FC<BlogPostNavigationProps> = ({
  steps,
  currentStep,
  isStepValid,
  goToStep,
  prevStep,
  nextStep,
}) => {
  return (
    <div className="flex-shrink-0 px-6 py-3 bg-gray-100 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => goToStep(step.number)}
              disabled={step.number > currentStep && !isStepValid(currentStep)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                currentStep === step.number
                  ? "bg-secondary-indigo text-white shadow-md"
                  : step.number <= currentStep
                    ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            Step {currentStep} of {steps.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="p-1 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextStep}
              disabled={
                currentStep === steps.length || !isStepValid(currentStep)
              }
              className="p-1 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostNavigation;

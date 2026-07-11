"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight, HiCheck } from "react-icons/hi";
import BlogPostBasicInfo from "./BlogPostBasicInfo";
import BlogPostTagManager from "./BlogPostTagManager";
import BlogPostContentBuilder, {
  BlogPostContentBuilderRef,
} from "./BlogPostContentBuilder";
import BlogPostPreview from "./BlogPostPreview";
import BlogPostProgressBar from "./BlogPostProgressBar";
import BlogPostNavigation from "./BlogPostNavigation";
import { BlogPost } from "@/types/Blog";

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSave: (formData: Partial<BlogPost>) => Promise<void>;
  onAutoSaveDraft?: (formData: Partial<BlogPost>) => Promise<BlogPost | null>;
  onDraftChange?: (formData: Partial<BlogPost>) => void;
  onCancel: () => void;
}

interface Step {
  number: number;
  title: string;
  component: string;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  post,
  onSave,
  onAutoSaveDraft,
  onDraftChange,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: [],
    image: "",
    readTime: "",
    category: "",
    tags: [],
    published: true,
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add ref for content builder
  const contentBuilderRef = useRef<BlogPostContentBuilderRef>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        published: post.published ?? true,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        published: true,
      }));
    }
  }, [post]);

  useEffect(() => {
    onDraftChange?.(formData);
  }, [formData, post, onDraftChange]);

  const hasDraftableContent = (data: Partial<BlogPost>): boolean => {
    return Boolean(
      data.title?.trim() ||
        data.excerpt?.trim() ||
        data.image?.trim() ||
        data.category?.trim() ||
        data.readTime?.trim() ||
        (data.tags || []).length > 0 ||
        (data.content || []).length > 0
    );
  };

  const buildSynchronizedFormData = useCallback((): Partial<BlogPost> => {
    const pendingBlock = contentBuilderRef.current?.getPendingContentBlock() || null;
    if (!pendingBlock) {
      return formData;
    }

    const existingContent = formData.content || [];
    return {
      ...formData,
      content: [...existingContent, pendingBlock],
    };
  }, [formData]);

  const shouldAutoSaveDraft = Boolean(onAutoSaveDraft && (!post || !post.published));

  const flushDraftBeforeClose = async (): Promise<void> => {
    if (!shouldAutoSaveDraft || !onAutoSaveDraft) {
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    const synchronizedFormData = buildSynchronizedFormData();
    if (!hasDraftableContent(synchronizedFormData)) {
      return;
    }

    try {
      const savedDraft = await onAutoSaveDraft({
        ...synchronizedFormData,
        published: false,
      });

      if (savedDraft?._id && !synchronizedFormData._id) {
        setFormData((prev) => ({
          ...prev,
          _id: savedDraft._id,
        }));
      }
    } catch (error) {
      console.error("Draft flush before close failed:", error);
    }
  };

  useEffect(() => {
    if (!shouldAutoSaveDraft || !onAutoSaveDraft || isSubmitting) {
      return;
    }

    const synchronizedFormData = buildSynchronizedFormData();
    if (!hasDraftableContent(synchronizedFormData)) {
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const savedDraft = await onAutoSaveDraft({
          ...synchronizedFormData,
          published: false,
        });

        if (savedDraft?._id && !synchronizedFormData._id) {
          setFormData((prev) => ({
            ...prev,
            _id: savedDraft._id,
          }));
        }
      } catch (error) {
        console.error("Draft autosave failed:", error);
      }
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    formData,
    onAutoSaveDraft,
    shouldAutoSaveDraft,
    isSubmitting,
    buildSynchronizedFormData,
  ]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const shouldSyncSlugFromTitle = (
    currentSlug: string | undefined,
    currentTitle: string | undefined
  ): boolean => {
    const slug = (currentSlug || "").trim();
    if (!slug) return true;
    if (slug.startsWith("draft-")) return true;
    // Keep syncing while the slug still matches the previous title
    return slug === generateSlug(currentTitle || "");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated: Partial<BlogPost> = {
        ...prev,
        [name]: newValue,
      };

      if (
        name === "title" &&
        typeof newValue === "string" &&
        shouldSyncSlugFromTitle(prev.slug, prev.title)
      ) {
        updated.slug = generateSlug(newValue);
      }

      return updated;
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!isStepValid(currentStep)) {
      setDebugInfo(`Step ${currentStep} validation failed`);
      return;
    }

    try {
      setIsSubmitting(true);
      setDebugInfo("Submitting form...");

      const synchronizedFormData = buildSynchronizedFormData();
      const finalFormData = {
        ...synchronizedFormData,
        published: true,
      };

      await onSave(finalFormData);
      setDebugInfo("Form submitted successfully!");
    } catch (error) {
      setDebugInfo(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: Step[] = [
    { number: 1, title: "Basic Info", component: "basic" },
    { number: 2, title: "Tags", component: "tags" },
    { number: 3, title: "Content", component: "content" },
    { number: 4, title: "Review", component: "review" },
  ];

  const isStepValid = (step: number): boolean => {
    let isValid = false;
    switch (step) {
      case 1:
        isValid = !!(
          formData.title &&
          formData.category &&
          formData.excerpt &&
          formData.image
        );
        break;
      case 2:
        isValid = true; // Tags are optional
        break;
      case 3:
        isValid = (formData.content || []).length > 0;
        break;
      case 4:
        isValid = true;
        break;
      default:
        isValid = false;
    }
    return isValid;
  };

  const goToStep = (stepNumber: number): void => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      if (stepNumber > currentStep && !isStepValid(currentStep)) {
        setDebugInfo(
          `Cannot proceed to step ${stepNumber}: current step ${currentStep} is not valid`
        );
        return;
      }
      setCurrentStep(stepNumber);
      setDebugInfo(`Moved to step ${stepNumber}`);
    }
  };

  const nextStep = (e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep < steps.length) {
      // Auto-save content if we're on step 3 (content) and moving to next step
      if (currentStep === 3) {
        // Trigger auto-save of any unsaved content
        contentBuilderRef.current?.autoSaveContent();
      }

      if (currentStep < steps.length - 1 && !isStepValid(currentStep)) {
        setDebugInfo(`Cannot proceed: step ${currentStep} is not valid`);
        return;
      }
      setCurrentStep(currentStep + 1);
      setDebugInfo(`Moved to step ${currentStep + 1}`);
    }
  };

  const prevStep = (e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setDebugInfo(`Moved to step ${currentStep - 1}`);
    }
  };

  const renderStepContent = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return (
          <BlogPostBasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <BlogPostTagManager formData={formData} setFormData={setFormData} />
        );
      case 3:
        return (
          <BlogPostContentBuilder
            ref={contentBuilderRef}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return <BlogPostPreview formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-4xl h-[98vh] sm:h-[95vh] bg-white rounded-2xl sm:rounded-3xl shadow-large flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200 sm:p-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold truncate sm:text-xl text-text-primary">
                {post ? "Edit Post" : "Create New Post"}
              </h2>
              <p className="text-xs text-gray-500 truncate sm:text-sm">
                Step {currentStep} of {steps.length}:{" "}
                {steps[currentStep - 1].title}
              </p>
            </div>
            <button
              onClick={() => {
                void flushDraftBeforeClose()
                  .catch((error) => {
                    console.error("Draft flush before close failed:", error);
                  })
                  .finally(() => {
                    onCancel();
                  });
              }}
              className="flex-shrink-0 p-2 ml-2 text-gray-400 transition-colors hover:text-gray-600 rounded-xl"
            >
              <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <BlogPostProgressBar
            steps={steps}
            currentStep={currentStep}
            isStepValid={isStepValid}
            goToStep={goToStep}
          />

          {/* Navigation */}
          <BlogPostNavigation
            steps={steps}
            currentStep={currentStep}
            isStepValid={isStepValid}
            goToStep={goToStep}
            prevStep={prevStep}
            nextStep={nextStep}
          />

          {/* Form Content */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 p-3 overflow-y-auto sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col flex-shrink-0 gap-3 p-3 border-t border-gray-200 sm:flex-row sm:gap-4 sm:p-6 bg-gray-50">
              {/* Mobile: Stack buttons vertically */}
              <div className="flex flex-col gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full">
                    <button
                      type="submit"
                      disabled={!isStepValid(currentStep) || isSubmitting}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          {post ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <HiCheck className="w-4 h-4" />
                          {post ? "Update Post" : "Create Post"}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Desktop: Horizontal layout */}
              <div className="items-center hidden w-full gap-4 sm:flex">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-2 text-gray-600 transition-colors border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex-1" />

                {/* Step Indicators */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {steps.map((step, index) => (
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

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <form onSubmit={handleSubmit} className="inline">
                    <button
                      type="submit"
                      disabled={!isStepValid(currentStep) || isSubmitting}
                      className="flex items-center gap-2 px-8 py-2 text-white transition-colors bg-secondary-indigo rounded-xl hover:bg-secondary-indigo/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                          {post ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <HiCheck className="w-4 h-4" />
                          {post ? "Update Post" : "Create Post"}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Cancel button - always visible */}
              <button
                type="button"
                onClick={() => {
                  void flushDraftBeforeClose()
                    .catch((error) => {
                      console.error("Draft flush before close failed:", error);
                    })
                    .finally(() => {
                      onCancel();
                    });
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-gray-600 transition-colors border border-gray-300 sm:px-6 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogPostForm;

"use client";
import React, { useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { FaTelegramPlane, FaGithub, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ScrollToTop from "../common/ScrollToTop";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Validation function
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Clear any existing errors
      setErrors({});

      // Send the request
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Redirect to success page after a short delay
        setTimeout(() => {
          window.location.href = "/success";
        }, 1000);
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        id="contact"
        className="min-h-[80vh] w-full flex items-center bg-bg-primary scroll-mt-20 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-r from-secondary-indigo/5 to-accent-emerald/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl px-6 mx-auto sm:px-8 lg:px-12">
          <div className="py-12 sm:py-16">
            {/* Section Header */}
            <motion.div
              className="mb-8 text-center sm:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 heading-2 text-text-primary">
                Let&#39;s Connect
              </h2>
              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-transparent to-secondary-indigo"></div>
                <div className="w-2 h-2 rounded-full sm:w-3 sm:h-3 bg-secondary-indigo"></div>
                <div className="w-8 h-px sm:w-16 bg-gradient-to-r from-secondary-indigo to-transparent"></div>
              </div>
            </motion.div>

            <div className="grid max-w-6xl gap-8 mx-auto lg:gap-12 lg:grid-cols-2">
              {/* Contact Information */}
              <motion.div
                className="order-2 space-y-6 sm:space-y-8 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div>
                  <h3 className="mb-4 sm:mb-6 heading-3 text-text-primary">
                    Get In Touch
                  </h3>
                  <p className="mb-4 sm:mb-8 body-large text-text-secondary">
                    Ready to start a project or have a question? I&#39;d love to
                    hear from you. Let&#39;s discuss how we can work together to
                    bring your ideas to life.
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-2 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    {/* <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-secondary-indigo/10 rounded-xl">
                      <HiMail className="text-lg sm:text-xl text-secondary-indigo" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">Email</h4>
                      <p className="text-sm sm:text-base text-text-secondary">
                        nanakumorprincewill@gmail.com
                      </p>
                    </div> */}
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-secondary-indigo/10 rounded-xl">
                      <HiLocationMarker className="text-lg sm:text-xl text-secondary-indigo" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        Location
                      </h4>
                      <p className="text-sm sm:text-base text-text-secondary">
                        Kyiv / Ukraine
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="mb-3 font-semibold sm:mb-4 text-text-primary">
                    Follow Me
                  </h4>
                  <div className="flex space-x-3 sm:space-x-4">
                    <Link
                      href="https://github.com/Princewill-Nanakumor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-white transition-all duration-300 w-9 h-9 sm:w-10 sm:h-10 bg-primary-slate rounded-xl hover:bg-gray-800 hover:scale-105"
                    >
                      <FaGithub className="text-sm sm:text-base" />
                    </Link>
                    <Link
                      href="https://www.linkedin.com/in/princewill-nanakumor-0a68b824a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-white transition-all duration-300 w-9 h-9 sm:w-10 sm:h-10 bg-secondary-indigo rounded-xl hover:bg-blue-700 hover:scale-105"
                    >
                      <FaLinkedinIn className="text-sm sm:text-base" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="p-6 transition-all duration-300 bg-white border border-gray-300 shadow-sm rounded-xl">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                    noValidate
                  >
                    {/* Name and Email Row */}
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-2 font-medium text-text-primary"
                        >
                          Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                            errors.name
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-secondary-indigo focus:ring-secondary-indigo/20"
                          }`}
                          placeholder="Your name"
                          disabled={loading}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 font-medium text-text-primary"
                        >
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                            errors.email
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:border-secondary-indigo focus:ring-secondary-indigo/20"
                          }`}
                          placeholder="your.email@example.com"
                          disabled={loading}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block mb-2 font-medium text-text-primary"
                      >
                        Subject *
                      </label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 ${
                          errors.subject
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-secondary-indigo focus:ring-secondary-indigo/20"
                        }`}
                        placeholder="What's this about?"
                        disabled={loading}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-2 font-medium text-text-primary"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
                          errors.message
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-secondary-indigo focus:ring-secondary-indigo/20"
                        }`}
                        placeholder="Tell me about your project..."
                        disabled={loading}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-white transition-all duration-300 rounded-lg bg-secondary-indigo hover:bg-blue-700 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      <FaTelegramPlane className="text-lg" />
                      <span>{loading ? "Sending..." : "Send Message"}</span>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
};

export default Contact;

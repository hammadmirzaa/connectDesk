import React, { useState } from "react";
import { motion } from "@motionone/react";

// Replace these with your own SVGs, illustrations, or Lottie if you want!
const illustrations = [
  // Collaborative tool
  <svg key="collab" width="140" height="140" viewBox="0 0 100 100" className="mx-auto">
    <circle cx="50" cy="50" r="48" fill="#e0f2fe" />
    <rect x="22" y="35" width="56" height="30" rx="6" fill="#38bdf8" />
    <circle cx="35" cy="75" r="9" fill="#a5b4fc" />
    <circle cx="65" cy="75" r="9" fill="#a5b4fc" />
    <rect x="38" y="40" width="24" height="8" rx="3" fill="#fff" />
  </svg>,
  // Communicate in real time
  <svg key="chat" width="140" height="140" viewBox="0 0 100 100" className="mx-auto">
    <circle cx="50" cy="50" r="48" fill="#ede9fe" />
    <rect x="24" y="35" width="52" height="20" rx="6" fill="#6366f1" />
    <rect x="30" y="41" width="16" height="6" rx="2" fill="#fff" />
    <rect x="54" y="41" width="16" height="6" rx="2" fill="#fff" />
    <rect x="38" y="57" width="24" height="8" rx="4" fill="#fbbf24" />
  </svg>,
  // Create boards and tasks
  <svg key="boards" width="140" height="140" viewBox="0 0 100 100" className="mx-auto">
    <circle cx="50" cy="50" r="48" fill="#fef9c3" />
    <rect x="24" y="38" width="22" height="28" rx="4" fill="#facc15" />
    <rect x="54" y="38" width="22" height="16" rx="4" fill="#facc15" />
    <rect x="54" y="58" width="22" height="8" rx="4" fill="#fde68a" />
  </svg>,
  // Ask AI
  <svg key="ai" width="140" height="140" viewBox="0 0 100 100" className="mx-auto">
    <circle cx="50" cy="50" r="48" fill="#f1f5f9" />
    <ellipse cx="50" cy="55" rx="24" ry="18" fill="#818cf8" />
    <ellipse cx="50" cy="53" rx="18" ry="10" fill="#fff" />
    <circle cx="50" cy="50" r="6" fill="#818cf8" />
    <circle cx="50" cy="50" r="2.5" fill="#fff" />
    <rect x="44" y="70" width="12" height="6" rx="3" fill="#818cf8" />
  </svg>,
];

const steps = [
  {
    title: "Collaborative workspace",
    subtitle: "ConnectDesk is your team's digital hub.",
    description: "Organize projects, share ideas, and boost productivity—one board at a time.",
  },
  {
    title: "Real-time communication",
    subtitle: "Chat and collaborate instantly.",
    description: "Message, mention, and connect with your teammates in the moment.",
  },
  {
    title: "Create boards & tasks",
    subtitle: "Visualize work your way.",
    description: "Plan, track, and complete tasks with our flexible Kanban boards.",
  },
  {
    title: "Ask AI for help",
    subtitle: "Your smart assistant, always available.",
    description: "Summarize, brainstorm, and solve problems with built-in AI.",
  },
];

export default function OnBoarding({ onFinish }) {
  const [step, setStep] = useState(0);

  const stepCount = steps.length;
  const nextStep = () => setStep((s) => Math.min(s + 1, stepCount - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7faff] to-[#e3eaf5] px-4">
      <motion.div
        className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl flex overflow-hidden"
        initial={{ opacity: 0, scale: 0.96, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        {/* Left: Text */}
        <div className="w-1/2 p-12 flex flex-col justify-center bg-gradient-to-b from-[#f0f9ff] to-[#fff]">
          <img src="/logo192.png" alt="ConnectDesk" className="w-12 h-12 mb-5" />
          <div className="flex gap-2 mb-8">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-10 rounded-full transition-all duration-300 ${idx <= step ? "bg-blue-600" : "bg-gray-200"}`}
                style={{ opacity: idx === step ? 1 : 0.5 }}
              />
            ))}
          </div>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "ease" }}
            className="space-y-3"
          >
            <div className="text-2xl font-bold text-blue-900">{steps[step].title}</div>
            <div className="text-blue-500 font-semibold text-base">{steps[step].subtitle}</div>
            <div className="text-gray-600">{steps[step].description}</div>
          </motion.div>
          <div className="mt-12 flex gap-3">
            <button
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
              onClick={prevStep}
              disabled={step === 0}
            >
              Back
            </button>
            {step < stepCount - 1 ? (
              <button
                className="px-7 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow transition"
                onClick={nextStep}
              >
                Next
              </button>
            ) : (
              <button
                className="px-7 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow transition"
                onClick={onFinish || (() => alert("Onboarding complete!"))}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "ease" }}
            className="w-full flex items-center justify-center"
          >
            {illustrations[step]}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

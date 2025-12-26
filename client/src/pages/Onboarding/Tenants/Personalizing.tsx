import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch,
  IconHomeHeart,
  IconMapPin,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";

export default function PersonalizingScreen() {
  const [step, setStep] = useState(0);

  const loadingSteps = [
    {
      icon: IconSearch,
      text: "Analyzing your preferences...",
      color: "text-blue-400",
    },
    {
      icon: IconMapPin,
      text: "Scanning preferred locations...",
      color: "text-secondary",
    },
    {
      icon: IconHomeHeart,
      text: "Matching with verified listings...",
      color: "text-pink-400",
    },
    {
      icon: IconShieldCheck,
      text: "Verifying landlord credentials...",
      color: "text-green-400",
    },
    {
      icon: IconSparkles,
      text: "Curating your perfect matches...",
      color: "text-yellow-400",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Animated Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-[300px] h-[300px] border border-white rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute w-[500px] h-[500px] border border-white rounded-full"
        />
      </div>

      {/* Central Content */}
      <div className="relative z-10 text-center max-w-md">
        <div className="mb-12 relative flex justify-center">
          {/* Main Animated Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.8 }}
              className={`p-6 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 ${loadingSteps[step].color}`}
            >
              {(() => {
                const Icon = loadingSteps[step].icon;
                return <Icon size={48} stroke={1.5} />;
              })()}
            </motion.div>
          </AnimatePresence>

          {/* Floating Particles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-4 border-2 border-dashed border-secondary/30 rounded-full"
          />
        </div>

        <h2 className="text-2xl font-bold font-sora text-white mb-4 tracking-tight">
          Personalizing Your Experience
        </h2>

        <div className="h-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-gray-400 font-medium tracking-wide"
            >
              {loadingSteps[step].text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / loadingSteps.length) * 100}%` }}
            className="h-full bg-secondary shadow-[0_0_15px_rgba(234,179,8,0.5)]"
          />
        </div>

        <p className="mt-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">
          Matching Engine v1.0
        </p>
      </div>
    </div>
  );
}

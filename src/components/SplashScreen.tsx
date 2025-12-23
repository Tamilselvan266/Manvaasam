import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sprout } from 'lucide-react';
import type { Language } from '../App';

interface SplashScreenProps {
  onComplete: () => void;
  language: Language;
}

const thirukkurals = [
  { en: "Farming, though laborious, is the work supreme.", ta: "உழுவார் உலகத்தார்க்கு ஆணி.", hi: "खेती महान कार्य है।" },
  { en: "Where farmers thrive, there the country prospers.", ta: "உழுதுண்டு வாழ்வாரே வாழ்வார்.", hi: "किसान का सम्मान देश का गौरव है।" },
  { en: "Work is the foundation of all wealth.", ta: "தொழுதல் செல்வம் மிக்க வேண்டும்.", hi: "परिश्रम सफलता की कुंजी है।" }
];

export function SplashScreen({ onComplete, language }: SplashScreenProps) {
  const [kural] = useState(() => thirukkurals[Math.floor(Math.random() * thirukkurals.length)]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-green-500 to-blue-600 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="bg-white/20 backdrop-blur-lg rounded-full p-8 shadow-2xl">
          <Sprout className="w-24 h-24 text-white" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-white text-5xl mb-4 tracking-wide"
      >
        Manvaasam
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-white/90 text-center text-lg max-w-md italic px-4"
      >
        "{kural[language] || kural.en}"
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-white/70 text-sm"
      >
        Connecting Farmers & Industries
      </motion.div>
    </div>
  );
}

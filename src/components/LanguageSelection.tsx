import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import type { Language } from '../App';

interface LanguageSelectionProps {
  onSelect: (language: Language) => void;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
];

export function LanguageSelection({ onSelect }: LanguageSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-full p-6 inline-block mb-4 shadow-lg">
          <Globe className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-gray-800 mb-2">Select Your Language</h1>
        <p className="text-gray-600">உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்</p>
      </motion.div>

      <div className="w-full max-w-md space-y-3">
        {languages.map((lang, index) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(lang.code)}
            className="w-full bg-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white transition-all duration-300 text-gray-800 rounded-2xl shadow-md hover:shadow-xl p-6 flex items-center justify-between group"
          >
            <div className="text-left">
              <div className="group-hover:text-white transition-colors">{lang.name}</div>
              <div className="text-xl group-hover:text-white/90 transition-colors">{lang.nativeName}</div>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500 group-hover:bg-white transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

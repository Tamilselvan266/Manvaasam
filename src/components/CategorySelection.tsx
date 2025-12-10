import { motion } from 'motion/react';
import { Sprout, Building2 } from 'lucide-react';
import type { Language, UserType } from '../App';

interface CategorySelectionProps {
  onSelect: (type: UserType) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'I am a...',
    farmer: 'Farmer',
    farmerDesc: 'Sell your harvest directly to industries',
    industry: 'Industry',
    industryDesc: 'Source quality produce from farmers'
  },
  ta: {
    title: 'நான் ஒரு...',
    farmer: 'விவசாயி',
    farmerDesc: 'உங்கள் விளைச்சலை நேரடியாக விற்கவும்',
    industry: 'தொழிற்சாலை',
    industryDesc: 'விவசாயிகளிடம் இருந்து தரமான பொருட்களை பெறவும்'
  }
};

export function CategorySelection({ onSelect, language }: CategorySelectionProps) {
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-800 mb-12 text-center"
      >
        {t.title}
      </motion.h1>

      <div className="w-full max-w-md space-y-6">
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onSelect('farmer')}
          className="w-full bg-white hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-2xl p-8 group"
        >
          <div className="flex items-center gap-6">
            <div className="bg-green-100 group-hover:bg-white/20 transition-colors rounded-2xl p-6">
              <Sprout className="w-12 h-12 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-gray-800 group-hover:text-white transition-colors mb-2">{t.farmer}</h2>
              <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm">
                {t.farmerDesc}
              </p>
            </div>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onSelect('industry')}
          className="w-full bg-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-2xl p-8 group"
        >
          <div className="flex items-center gap-6">
            <div className="bg-blue-100 group-hover:bg-white/20 transition-colors rounded-2xl p-6">
              <Building2 className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-gray-800 group-hover:text-white transition-colors mb-2">{t.industry}</h2>
              <p className="text-gray-600 group-hover:text-white/90 transition-colors text-sm">
                {t.industryDesc}
              </p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}

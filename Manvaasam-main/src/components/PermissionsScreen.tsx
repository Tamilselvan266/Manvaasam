import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Bell, Check } from 'lucide-react';
import { Button } from './ui/button';
import type { Language } from '../App';

interface PermissionsScreenProps {
  onComplete: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'We need your permission',
    subtitle: 'To provide you the best experience',
    location: 'Location Access',
    locationDesc: 'To show nearby matches and relevant schemes',
    notifications: 'Push Notifications',
    notificationsDesc: 'Get alerts when new matches are found',
    continue: 'Continue'
  },
  ta: {
    title: 'உங்கள் அனுமதி தேவை',
    subtitle: 'சிறந்த அனுபவத்தை வழங்க',
    location: 'இடம் அணுகல்',
    locationDesc: 'அருகிலுள்ள பொருத்தங்களைக் காட்ட',
    notifications: 'அறிவிப்புகள்',
    notificationsDesc: 'புதிய பொருத்தங்கள் கிடைக்கும்போது',
    continue: 'தொடரவும்'
  }
};

export function PermissionsScreen({ onComplete, language }: PermissionsScreenProps) {
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  
  const t = translations[language] || translations.en;

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setLocationGranted(true) // Grant anyway for demo
      );
    } else {
      setLocationGranted(true);
    }
  };

  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {
        setNotificationsGranted(true);
      });
    } else {
      setNotificationsGranted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-gray-800 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </motion.div>

      <div className="w-full max-w-md space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 mb-1">{t.location}</h3>
              <p className="text-gray-600 text-sm mb-3">{t.locationDesc}</p>
              {locationGranted ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Granted</span>
                </div>
              ) : (
                <Button onClick={requestLocation} className="bg-green-600 hover:bg-green-700">
                  Allow
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 mb-1">{t.notifications}</h3>
              <p className="text-gray-600 text-sm mb-3">{t.notificationsDesc}</p>
              {notificationsGranted ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Granted</span>
                </div>
              ) : (
                <Button onClick={requestNotifications} className="bg-blue-600 hover:bg-blue-700">
                  Allow
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {locationGranted && notificationsGranted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 rounded-xl shadow-lg text-lg"
          >
            {t.continue}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

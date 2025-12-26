import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Bell } from 'lucide-react';
import { Button } from './ui/button';
import type { Language } from '../App';

interface PermissionsScreenProps {
  onComplete: () => void;
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    locationTitle: 'Allow Location Access',
    locationDesc: 'We need your location to provide you with nearby services and accurate information.',
    notificationsTitle: 'Enable Notifications',
    notificationsDesc: 'Get important updates, alerts, and notifications about your farming activities.',
    allow: 'Allow',
    noThanks: 'No, thanks',
    deny: 'Deny'
  },
  ta: {
    locationTitle: 'இடம் அணுகலை அனுமதிக்கவும்',
    locationDesc: 'அருகிலுள்ள சேவைகள் மற்றும் துல்லியமான தகவல்களை வழங்க உங்கள் இடம் தேவை.',
    notificationsTitle: 'அறிவிப்புகளை இயக்கவும்',
    notificationsDesc: 'உங்கள் விவசாய நடவடிக்கைகள் பற்றிய முக்கியமான புதுப்பிப்புகள், எச்சரிக்கைகள் மற்றும் அறிவிப்புகளைப் பெறுங்கள்.',
    allow: 'அனுமதி',
    noThanks: 'இல்லை, நன்றி',
    deny: 'மறு'
  },
  hi: {
    locationTitle: 'स्थान पहुंच की अनुमति दें',
    locationDesc: 'आस-पास की सेवाएं और सटीक जानकारी प्रदान करने के लिए हमें आपके स्थान की आवश्यकता है।',
    notificationsTitle: 'सूचनाएं सक्षम करें',
    notificationsDesc: 'अपनी खेती की गतिविधियों के बारे में महत्वपूर्ण अपडेट, अलर्ट और सूचनाएं प्राप्त करें।',
    allow: 'अनुमति दें',
    noThanks: 'नहीं, धन्यवाद',
    deny: 'अस्वीकार'
  }
};

export function PermissionsScreen({ onComplete, onBack, language }: PermissionsScreenProps) {
  const [currentPermission, setCurrentPermission] = useState<'location' | 'notification'>('location');
  
  const t = translations[language] || translations.en;

  const handleLocationAllow = () => {
    // This will trigger the browser's native location permission dialog
    // with options like "Allow", "Block", "While visiting the site", "Only this time"
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Location successfully accessed, move to notification permission
          console.log('Location accessed:', position.coords.latitude, position.coords.longitude);
          setCurrentPermission('notification');
        },
        (error) => {
          // Location access denied or failed
          console.error('Location access denied:', error);
          // Still move to notification permission even if location fails
          setCurrentPermission('notification');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Geolocation not available, move to notification permission
      setCurrentPermission('notification');
    }
  };

  const handleLocationDeny = () => {
    // Deny location, go back to splash screen
    onBack();
  };

  const handleNotificationAllow = async () => {
    if ('Notification' in window) {
      try {
        await Notification.requestPermission();
        // Move to next screen regardless of permission result
        onComplete();
      } catch (error) {
        // Error requesting permission, still continue
        onComplete();
      }
    } else {
      // Notifications not supported, continue
      onComplete();
    }
  };

  const handleNotificationDeny = () => {
    // Deny notification, continue to app
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-green-500 to-blue-600 flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {currentPermission === 'location' && (
          <motion.div
            key="location"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <MapPin className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
              {t.locationTitle}
            </h2>

            <p className="text-gray-600 text-center mb-8">
              {t.locationDesc}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLocationAllow}
                className="bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-xl"
              >
                {t.allow}
              </Button>

              <Button
                variant="ghost"
                onClick={handleLocationDeny}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-6 text-lg rounded-xl"
              >
                {t.deny}
              </Button>
            </div>
          </motion.div>
        )}

        {currentPermission === 'notification' && (
          <motion.div
            key="notification"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <Bell className="w-12 h-12 text-green-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
              {t.notificationsTitle}
            </h2>

            <p className="text-gray-600 text-center mb-8">
              {t.notificationsDesc}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleNotificationAllow}
                className="bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-xl"
              >
                {t.allow}
              </Button>

              <Button
                variant="ghost"
                onClick={handleNotificationDeny}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 py-6 text-lg rounded-xl"
              >
                {t.deny}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

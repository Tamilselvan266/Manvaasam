import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { mockAuth } from '../utils/mockAuth';
import type { Language, UserType } from '../App';

interface LoginScreenProps {
  onSuccess: (token: string, needsRegistration: boolean, userType: UserType, userData?: any) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Welcome to Manvaasam',
    subtitle: 'Login to continue',
    phonePlaceholder: 'Enter 10-digit phone number',
    sendOtp: 'Send OTP',
    otpPlaceholder: 'Enter 6-digit OTP',
    verify: 'Verify & Login',
    resend: 'Resend OTP'
  },
  ta: {
    title: 'மன்வாசத்திற்கு வரவேற்கிறோம்',
    subtitle: 'தொடர உள்நுழையவும்',
    phonePlaceholder: '10 இலக்க தொலைபேசி எண்',
    sendOtp: 'OTP அனுப்பு',
    otpPlaceholder: '6 இலக்க OTP',
    verify: 'சரிபார்த்து உள்நுழை',
    resend: 'மீண்டும் அனுப்பு'
  }
};

export function LoginScreen({ onSuccess, language }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = translations[language] || translations.en;

  const sendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try real backend first
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/send-otp`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ phone })
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('[LoginScreen] Send OTP response (backend):', data);

          if (data.success) {
            setOtpSent(true);
            console.log('OTP:', data.otp);
            alert(`OTP sent! For demo: ${data.otp}`);
            return;
          }
        }
      } catch (backendError) {
        console.log('[LoginScreen] Backend not available, using mock auth');
      }

      // Fallback to mock auth
      const data = await mockAuth.sendOTP(phone);
      console.log('[LoginScreen] Send OTP response (mock):', data);

      if (data.success) {
        setOtpSent(true);
        console.log('OTP:', data.otp);
        alert(`OTP sent! For demo: ${data.otp}`);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try real backend first
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/verify-otp`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ phone, otp })
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('[LoginScreen] OTP verification response (backend):', data);

          if (data.success) {
            console.log('[LoginScreen] Calling onSuccess with:', {
              hasToken: !!data.accessToken,
              needsRegistration: data.needsRegistration,
              userType: data.userType,
              hasUserData: !!data.userData
            });
            onSuccess(data.accessToken, data.needsRegistration, data.userType, data.userData);
            return;
          } else {
            setError(data.error || 'Invalid OTP');
            return;
          }
        }
      } catch (backendError) {
        console.log('[LoginScreen] Backend not available, using mock auth');
      }

      // Fallback to mock auth
      const data = await mockAuth.verifyOTP(phone, otp);
      console.log('[LoginScreen] OTP verification response (mock):', data);

      if (data.success) {
        console.log('[LoginScreen] Calling onSuccess with:', {
          hasToken: !!data.accessToken,
          needsRegistration: data.needsRegistration,
          userType: data.userType,
          hasUserData: !!data.userData
        });
        onSuccess(data.accessToken, data.needsRegistration, data.userType, data.userData);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-blue-600 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 text-white">
          <h1 className="mb-2">{t.title}</h1>
          <p className="text-white/80">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 rounded-full p-2">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <label className="text-gray-700">Phone Number</label>
            </div>
            <Input
              type="tel"
              placeholder={t.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={otpSent}
              className="text-lg py-6"
              maxLength={10}
            />
          </div>

          {!otpSent ? (
            <Button
              onClick={sendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg rounded-xl"
            >
              {loading ? 'Sending...' : t.sendOtp}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <>
              <div className="mb-6">
                <label className="text-gray-700 mb-3 block">OTP</label>
                <Input
                  type="text"
                  placeholder={t.otpPlaceholder}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-lg py-6 text-center tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg rounded-xl mb-3"
              >
                {loading ? 'Verifying...' : t.verify}
              </Button>

              <Button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
                variant="ghost"
                className="w-full text-gray-600"
              >
                {t.resend}
              </Button>
            </>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-4 text-center"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
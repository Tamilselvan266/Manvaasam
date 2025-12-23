import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Language, UserType } from '../App';
import { auth, setupRecaptcha } from '../firebase/config';
import { sendOtp, verifyOtp } from '../firebase/auth';
import { RecaptchaVerifier } from 'firebase/auth';

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
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  // Default to English if language not found
  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    recaptchaVerifier.current = setupRecaptcha('recaptcha-container');
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, []);

  const sendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use Firebase to send OTP
      const result = await sendOtp(phone, recaptchaVerifier.current!);
      
      if (result.success) {
        setConfirmationResult(result.confirmation);
        setOtpSent(true);
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error in sendOTP:', err);
      setError('Failed to send OTP. Please try again.');
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
      const result = await verifyOtp(confirmationResult, otp);
      
      if (result.success && result.user) {
        // On successful verification
        const userData = {
          id: result.user.uid,
          type: 'farmer' as UserType,
          mrid: `MR${phone}`,
          phone: result.user.phoneNumber || phone
        };
        
        // Get the ID token for backend authentication
        const token = await auth.currentUser?.getIdToken() || '';
        
        // Call onSuccess with the token and user data
        onSuccess(token, false, 'farmer', userData);
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Error in verifyOTP:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" className="invisible"></div>
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
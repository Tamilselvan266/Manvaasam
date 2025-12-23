import { auth } from './config';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

export const sendOtp = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const appVerifier = recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier);
    return { success: true, confirmation: confirmationResult };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send OTP. Please try again.' 
    };
  }
};

export const verifyOtp = async (confirmation: any, otp: string) => {
  try {
    const result = await confirmation.confirm(otp);
    const user = result.user;
    return { 
      success: true, 
      user: {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        // Add any other user data you want to include
      }
    };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: error.message || 'Invalid OTP. Please try again.' 
    };
  }
};

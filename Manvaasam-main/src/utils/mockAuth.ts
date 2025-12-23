// Mock Authentication for Development
// This simulates the backend behavior when Supabase functions aren't available

interface OTPStore {
  [phone: string]: {
    code: string;
    expires: number;
  };
}

interface UserStore {
  [userId: string]: any;
}

// In-memory storage (will reset on page refresh)
const otpStore: OTPStore = {};
const userStore: UserStore = {};

export const mockAuth = {
  async sendOTP(phone: string) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!phone || phone.length !== 10) {
        throw new Error('Invalid phone number');
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with 5-minute expiry
      otpStore[phone] = {
        code: otp,
        expires: Date.now() + 5 * 60 * 1000
      };

      console.log(`[MockAuth] OTP for ${phone}: ${otp}`);
      
      return {
        success: true,
        message: 'OTP sent successfully',
        otp // Return OTP for demo
      };
    } catch (error) {
      console.error('[MockAuth] Error sending OTP:', error);
      return {
        success: false,
        error: 'Failed to send OTP'
      };
    }
  },

  async verifyOTP(phone: string, otp: string) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const storedData = otpStore[phone];
      
      if (!storedData) {
        return {
          success: false,
          error: 'OTP expired or not found'
        };
      }

      if (storedData.expires < Date.now()) {
        delete otpStore[phone];
        return {
          success: false,
          error: 'OTP expired'
        };
      }

      if (storedData.code !== otp) {
        return {
          success: false,
          error: 'Invalid OTP'
        };
      }

      // OTP verified, delete it
      delete otpStore[phone];

      // Check if user exists by phone number (not by userId)
      const existingUser = Object.values(userStore).find(
        (user: any) => user.phone === phone
      );

      if (existingUser) {
        // User exists, return their data
        console.log('[MockAuth] Returning existing user:', existingUser.mrid);
        return {
          success: true,
          accessToken: existingUser.id,
          needsRegistration: false,
          userType: existingUser.type,
          userData: existingUser
        };
      }

      // New user, needs registration
      // Generate unique user ID based on phone and timestamp
      const userId = `user_${phone}_${Date.now()}`;
      console.log('[MockAuth] New user needs registration, userId:', userId);
      
      return {
        success: true,
        accessToken: userId,
        needsRegistration: true,
        userType: null,
        userData: null
      };
    } catch (error) {
      console.error('[MockAuth] Error verifying OTP:', error);
      return {
        success: false,
        error: 'Failed to verify OTP'
      };
    }
  },

  async registerFarmer(data: any) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mrid = `F${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const farmerData = {
        id: data.userId,
        type: 'farmer',
        mrid,
        name: data.name,
        aadhaar: data.aadhaar,
        address: data.address,
        phone: data.phone,
        photo: data.photo,
        createdAt: Date.now(),
        harvests: []
      };

      userStore[data.userId] = farmerData;
      
      return {
        success: true,
        mrid,
        userData: farmerData
      };
    } catch (error) {
      console.error('[MockAuth] Error registering farmer:', error);
      return {
        success: false,
        error: 'Failed to register farmer'
      };
    }
  },

  async registerIndustry(data: any) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mrid = `I${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const industryData = {
        id: data.userId,
        type: 'industry',
        mrid,
        companyName: data.companyName,
        industryType: data.type,
        ownerName: data.ownerName,
        aadhaar: data.aadhaar,
        location: data.location,
        phone: data.phone,
        photo: data.photo,
        createdAt: Date.now(),
        demands: []
      };

      userStore[data.userId] = industryData;
      
      return {
        success: true,
        mrid,
        userData: industryData
      };
    } catch (error) {
      console.error('[MockAuth] Error registering industry:', error);
      return {
        success: false,
        error: 'Failed to register industry'
      };
    }
  },

  // Get user store for debugging
  getUserStore() {
    return userStore;
  }
};
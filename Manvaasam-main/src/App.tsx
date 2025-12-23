import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LanguageSelection } from './components/LanguageSelection';
import { PermissionsScreen } from './components/PermissionsScreen';
import { LoginScreen } from './components/LoginScreen';
import { CategorySelection } from './components/CategorySelection';
import { FarmerRegistration } from './components/FarmerRegistration';
import { IndustryRegistration } from './components/IndustryRegistration';
import { FarmerHome } from './components/FarmerHome';
import { IndustryHome } from './components/IndustryHome';

export type Language = 'en' | 'ta' | 'hi' | 'kn' | 'ml' | 'te';
export type UserType = 'farmer' | 'industry' | null;

export interface UserData {
  id: string;
  type: UserType;
  mrid: string;
  [key: string]: any;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('[App] Screen changed to:', currentScreen);
    console.log('[App] State:', { hasToken: !!accessToken, hasUserData: !!userData, userType });
  }, [currentScreen, accessToken, userData, userType]);

  useEffect(() => {
    // Check for existing session
    const storedLanguage = localStorage.getItem('manvaasam_language');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage as Language);
    }

    const storedToken = localStorage.getItem('manvaasam_token');
    const storedUser = localStorage.getItem('manvaasam_user');
    
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      const user = JSON.parse(storedUser);
      setUserData(user);
      setUserType(user.type);
      setCurrentScreen(user.type === 'farmer' ? 'farmer-home' : 'industry-home');
    }
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem('manvaasam_language', language);
    setCurrentScreen('permissions');
  };

  const handlePermissionsGranted = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (token: string, needsRegistration: boolean, type: UserType, userData?: UserData | null) => {
    console.log('[App] Login success:', { token: !!token, needsRegistration, type, userData: !!userData });
    
    // Clear all previous user data first
    console.log('[App] Clearing previous user data...');
    setUserData(null);
    setUserType(null);
    
    // Use setTimeout to ensure state updates happen in correct order
    setIsLoading(true);
    setAccessToken(token);
    localStorage.setItem('manvaasam_token', token);
    
    if (needsRegistration) {
      console.log('[App] Needs registration, showing category selection');
      setTimeout(() => {
        setCurrentScreen('category-selection');
        setIsLoading(false);
      }, 100);
    } else {
      // User already has a profile, set all the data
      console.log('[App] Has profile, navigating to home');
      setUserType(type);
      if (userData) {
        setUserData(userData);
        localStorage.setItem('manvaasam_user', JSON.stringify(userData));
      }
      const nextScreen = type === 'farmer' ? 'farmer-home' : 'industry-home';
      console.log('[App] Setting screen to:', nextScreen);
      setTimeout(() => {
        setCurrentScreen(nextScreen);
        setIsLoading(false);
      }, 100);
    }
  };

  const handleCategorySelect = (type: UserType) => {
    setUserType(type);
    setCurrentScreen(type === 'farmer' ? 'farmer-registration' : 'industry-registration');
  };

  const handleRegistrationComplete = (user: UserData) => {
    setUserData(user);
    localStorage.setItem('manvaasam_user', JSON.stringify(user));
    setCurrentScreen(user.type === 'farmer' ? 'farmer-home' : 'industry-home');
  };

  const handleLogout = () => {
    localStorage.removeItem('manvaasam_token');
    localStorage.removeItem('manvaasam_user');
    setAccessToken(null);
    setUserData(null);
    setUserType(null);
    setCurrentScreen('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading state */}
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-blue-600">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      )}

      {!isLoading && currentScreen === 'splash' && (
        <SplashScreen onComplete={() => setCurrentScreen('language')} language={selectedLanguage} />
      )}
      
      {!isLoading && currentScreen === 'language' && (
        <LanguageSelection onSelect={handleLanguageSelect} />
      )}
      
      {!isLoading && currentScreen === 'permissions' && (
        <PermissionsScreen onComplete={handlePermissionsGranted} language={selectedLanguage} />
      )}
      
      {!isLoading && currentScreen === 'login' && (
        <LoginScreen onSuccess={handleLoginSuccess} language={selectedLanguage} />
      )}
      
      {!isLoading && currentScreen === 'category-selection' && (
        <CategorySelection onSelect={handleCategorySelect} language={selectedLanguage} />
      )}
      
      {!isLoading && currentScreen === 'farmer-registration' && accessToken && (
        <FarmerRegistration
          userId={accessToken}
          onComplete={handleRegistrationComplete}
          language={selectedLanguage}
        />
      )}
      
      {!isLoading && currentScreen === 'industry-registration' && accessToken && (
        <IndustryRegistration
          userId={accessToken}
          onComplete={handleRegistrationComplete}
          language={selectedLanguage}
        />
      )}
      
      {!isLoading && currentScreen === 'farmer-home' && userData && (
        <FarmerHome
          userData={userData}
          onLogout={handleLogout}
          language={selectedLanguage}
        />
      )}
      
      {!isLoading && currentScreen === 'industry-home' && userData && (
        <IndustryHome
          userData={userData}
          onLogout={handleLogout}
          language={selectedLanguage}
        />
      )}

      {/* Fallback for invalid states */}
      {!isLoading && 
       currentScreen !== 'splash' && 
       currentScreen !== 'language' && 
       currentScreen !== 'permissions' && 
       currentScreen !== 'login' && 
       currentScreen !== 'category-selection' && 
       currentScreen !== 'farmer-registration' && 
       currentScreen !== 'industry-registration' && 
       currentScreen !== 'farmer-home' && 
       currentScreen !== 'industry-home' && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Something went wrong</p>
            <button
              onClick={() => setCurrentScreen('login')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
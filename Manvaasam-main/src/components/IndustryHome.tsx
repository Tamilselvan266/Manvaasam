import { useState } from 'react';
import { Menu, ShoppingCart, Package, BarChart3, FileText, GraduationCap, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { AllDemands } from './industry/AllDemands';
import { AllHarvests } from './industry/AllHarvests';
import { IndustryRecords } from './industry/IndustryRecords';
import { Schemes } from './farmer/Schemes';
import { Learning } from './farmer/Learning';
import { IndustryProfile } from './industry/IndustryProfile';
import type { Language, UserData } from '../App';

interface IndustryHomeProps {
  userData: UserData;
  onLogout: () => void;
  language: Language;
}

type Section = 'demands' | 'harvests' | 'records' | 'schemes' | 'learning' | 'profile';

const translations = {
  en: {
    greeting: 'Welcome',
    demands: 'Demands',
    harvests: 'Harvests',
    matchingHarvests: 'Matching Harvests',
    records: 'Records',
    schemes: 'Schemes',
    learning: 'Learning',
    profile: 'Profile',
    logout: 'Logout'
  },
  ta: {
    greeting: 'வரவேற்பு',
    demands: 'கோரிக்கைகள்',
    harvests: 'விளைச்சல்கள்',
    matchingHarvests: 'பொருந்தும் விளைச்சல்',
    records: 'பதிவுகள்',
    schemes: 'திட்டங்கள்',
    learning: 'கற்றல்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு'
  },
  hi: {
    greeting: 'स्वागत है',
    demands: 'मांगें',
    harvests: 'फसलें',
    matchingHarvests: 'मिलान फसलें',
    records: 'रिकॉर्ड',
    schemes: 'योजनाएं',
    learning: 'सीखना',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट'
  },
  kn: {
    greeting: 'ಸ್ವಾಗತ',
    demands: 'ಬೇಡಿಕೆಗಳು',
    harvests: 'ಸುಗ್ಗಿಗಳು',
    matchingHarvests: 'ಹೊಂದಾಣಿಕೆ ಸುಗ್ಗಿಗಳು',
    records: 'ದಾಖಲೆಗಳು',
    schemes: 'ಯೋಜನೆಗಳು',
    learning: 'ಕಲಿಕೆ',
    profile: 'ಪ್ರೊಫೈಲ್',
    logout: 'ಲಾಗ್ ಔಟ್'
  },
  ml: {
    greeting: 'സ്വാഗതം',
    demands: 'ആവശ്യങ്ങൾ',
    harvests: 'വിളവുകൾ',
    matchingHarvests: 'പൊരുത്തപ്പെടുന്ന വിളവുകൾ',
    records: 'രേഖകൾ',
    schemes: 'പദ്ധതികൾ',
    learning: 'പഠനം',
    profile: 'പ്രൊഫൈൽ',
    logout: 'ലോഗൗട്ട്'
  },
  te: {
    greeting: 'స్వాగతం',
    demands: 'డిమాండ్లు',
    harvests: 'పంటలు',
    matchingHarvests: 'సరిపోలు పంటలు',
    records: 'రికార్డులు',
    schemes: 'పథకాలు',
    learning: 'నేర్చుకోవడం',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్అవుట్'
  }
};

export function IndustryHome({ userData, onLogout, language }: IndustryHomeProps) {
  const [activeSection, setActiveSection] = useState<Section>('demands');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const t = translations[language] || translations.en;

  const menuItems = [
    { id: 'demands' as Section, label: t.demands, icon: ShoppingCart, color: 'text-blue-600' },
    { id: 'harvests' as Section, label: t.harvests, icon: Package, color: 'text-green-600' },
    { id: 'records' as Section, label: t.records, icon: BarChart3, color: 'text-purple-600' },
    { id: 'schemes' as Section, label: t.schemes, icon: FileText, color: 'text-orange-600' },
    { id: 'learning' as Section, label: t.learning, icon: GraduationCap, color: 'text-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white p-0 w-80">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    <img src={userData.photo} alt={userData.companyName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">{userData.companyName}</div>
                    <div className="text-white/80 text-xs">MRID: {userData.mrid}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-600' : item.color}`} />
                    <span>{item.label}</span>
                  </button>
                ))}

                <hr className="my-4" />

                <button
                  onClick={() => {
                    setActiveSection('profile');
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span>{t.profile}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <div>
            <div className="text-white/80 text-sm">{t.greeting},</div>
            <div className="text-lg">{userData.companyName}</div>
          </div>

          <div className="text-right">
            <div className="text-white/80 text-xs">MRID</div>
            <div className="text-sm">{userData.mrid}</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around py-2 max-w-6xl mx-auto">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeSection === item.id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {activeSection === 'demands' && <AllDemands userData={userData} language={language} />}
        {activeSection === 'harvests' && <AllHarvests userData={userData} language={language} />}
        {activeSection === 'records' && <IndustryRecords userData={userData} language={language} />}
        {activeSection === 'schemes' && <Schemes userType="industry" language={language} />}
        {activeSection === 'learning' && <Learning userType="industry" language={language} />}
        {activeSection === 'profile' && <IndustryProfile userData={userData} language={language} />}
      </div>
    </div>
  );
}

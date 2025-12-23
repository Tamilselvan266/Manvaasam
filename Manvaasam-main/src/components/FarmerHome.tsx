import { useState, useEffect } from 'react';
import { Menu, Plus, Package, Building2, BarChart3, Cloud, FileText, GraduationCap, User, LogOut, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { MyHarvests } from './farmer/MyHarvests';
import { AllDemands } from './farmer/AllDemands';
import { FarmerRecords } from './farmer/FarmerRecords';
import { Weather } from './farmer/Weather';
import { Schemes } from './farmer/Schemes';
import { Learning } from './farmer/Learning';
import { FarmerProfile } from './farmer/FarmerProfile';
import type { Language, UserData } from '../App';

interface FarmerHomeProps {
  userData: UserData;
  onLogout: () => void;
  language: Language;
}

type Section = 'harvests' | 'demands' | 'records' | 'weather' | 'schemes' | 'learning' | 'profile';

const translations = {
  en: {
    greeting: 'Welcome',
    myHarvests: 'My Harvests',
    demands: 'Demands',
    records: 'Records',
    weather: 'Weather',
    schemes: 'Schemes',
    learning: 'Learning',
    profile: 'Profile',
    logout: 'Logout',
    menu: 'Menu'
  },
  ta: {
    greeting: 'வரவேற்பு',
    myHarvests: 'எனது விளைச்சல்',
    demands: 'கோரிக்கைகள்',
    records: 'பதிவுகள்',
    weather: 'வானிலை',
    schemes: 'திட்டங்கள்',
    learning: 'கற்றல்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
    menu: 'பட்டி'
  }
};

export function FarmerHome({ userData, onLogout, language }: FarmerHomeProps) {
  const [activeSection, setActiveSection] = useState<Section>('harvests');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const t = translations[language] || translations.en;

  const menuItems = [
    { id: 'harvests' as Section, label: t.myHarvests, icon: Package, color: 'text-green-600' },
    { id: 'demands' as Section, label: t.demands, icon: Building2, color: 'text-blue-600' },
    { id: 'records' as Section, label: t.records, icon: BarChart3, color: 'text-purple-600' },
    { id: 'weather' as Section, label: t.weather, icon: Cloud, color: 'text-sky-600' },
    { id: 'schemes' as Section, label: t.schemes, icon: FileText, color: 'text-orange-600' },
    { id: 'learning' as Section, label: t.learning, icon: GraduationCap, color: 'text-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-6 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white p-0 w-80">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    <img src={userData.photo} alt={userData.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">{userData.name}</div>
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
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-green-600' : item.color}`} />
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
            <div className="text-lg">{userData.name}</div>
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
                activeSection === item.id ? 'text-green-600' : 'text-gray-600'
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
        {activeSection === 'harvests' && <MyHarvests userData={userData} language={language} />}
        {activeSection === 'demands' && <AllDemands userData={userData} language={language} />}
        {activeSection === 'records' && <FarmerRecords userData={userData} language={language} />}
        {activeSection === 'weather' && <Weather userData={userData} language={language} />}
        {activeSection === 'schemes' && <Schemes userType="farmer" language={language} />}
        {activeSection === 'learning' && <Learning userType="farmer" language={language} />}
        {activeSection === 'profile' && <FarmerProfile userData={userData} language={language} />}
      </div>
    </div>
  );
}

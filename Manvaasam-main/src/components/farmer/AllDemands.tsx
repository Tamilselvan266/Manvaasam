import { useState, useEffect } from 'react';
import { Building2, Package, MapPin, Phone, IndianRupee, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DialogDescription } from '../ui/dialog';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';
import { motion } from 'motion/react';

interface AllDemandsProps {
  userData: UserData;
  language: Language;
}

const translations = {
  en: {
    title: 'All Demands',
    subtitle: 'Browse all industry demands',
    allTab: 'All Demands',
    matchingTab: 'Matching',
    noDemands: 'No demands available',
    checkLater: 'Check back later for new opportunities',
    noMatching: 'No matching demands',
    noMatchingDesc: 'Post harvests to see matching demands',
    contact: 'Contact',
    deadline: 'Deadline',
    matchingBadge: 'Matches Your Products'
  },
  ta: {
    title: 'அனைத்து கோரிக்கைகள்',
    subtitle: 'தொழிற்சாலை கோரிக்கைகளை பார்க்கவும்',
    allTab: 'அனைத்து',
    matchingTab: 'பொருந்தும்',
    noDemands: 'கோரிக்கைகள் இல்லை',
    checkLater: 'பின்னர் சரிபார்க்கவும்',
    noMatching: 'பொருத்தங்கள் இல்லை',
    noMatchingDesc: 'விளைச்சலை பதிவிடவும்',
    contact: 'தொடர்பு',
    deadline: 'கடைசி நாள்',
    matchingBadge: 'உங்கள் பொருட்களுக்கு பொருந்தும்'
  },
  hi: {
    title: 'सभी मांगें',
    subtitle: 'उद्योग की मांगें देखें',
    allTab: 'सभी मांगें',
    matchingTab: 'मिलान',
    noDemands: 'कोई मांग उपलब्ध नहीं',
    checkLater: 'बाद में जांचें',
    noMatching: 'कोई मिलान नहीं',
    noMatchingDesc: 'फसल पोस्ट करें',
    contact: 'संपर्क',
    deadline: 'अंतिम तिथि',
    matchingBadge: 'आपके उत्पादों से मेल'
  },
  kn: {
    title: 'ಎಲ್ಲಾ ಬೇಡಿಕೆಗಳು',
    subtitle: 'ಉದ್ಯಮ ಬೇಡಿಕೆಗಳನ್ನು ನೋಡಿ',
    allTab: 'ಎಲ್ಲಾ',
    matchingTab: 'ಹೊಂದಾಣಿಕೆ',
    noDemands: 'ಬೇಡಿಕೆಗಳಿಲ್ಲ',
    checkLater: 'ನಂತರ ಪರಿಶೀಲಿಸಿ',
    noMatching: 'ಹೊಂದಾಣಿಕೆಯಿಲ್ಲ',
    noMatchingDesc: 'ಸುಗ್ಗಿಯನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ',
    contact: 'ಸಂಪರ್ಕಿಸಿ',
    deadline: 'ಕೊನೆಯ ದಿನಾಂಕ',
    matchingBadge: 'ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳಿಗೆ ಹೊಂದಾಣಿಕೆ'
  },
  ml: {
    title: 'എല്ലാ ആവശ്യങ്ങളും',
    subtitle: 'വ്യവസായ ആവശ്യങ്ങൾ കാണുക',
    allTab: 'എല്ലാം',
    matchingTab: 'പൊരുത്തം',
    noDemands: 'ആവശ്യങ്ങളില്ല',
    checkLater: 'പിന്നീട് പരിശോധിക്കുക',
    noMatching: 'പൊരുത്തങ്ങളില്ല',
    noMatchingDesc: 'വിളവെടുപ്പ് പോസ്റ്റ് ചെയ്യുക',
    contact: 'ബന്ധപ്പെടുക',
    deadline: 'അവസാന തീയതി',
    matchingBadge: 'നിങ്ങളുടെ ഉൽപ്പന്നങ്ങളുമായി പൊരുത്തപ്പെടുന്നു'
  },
  te: {
    title: 'అన్ని డిమాండ్లు',
    subtitle: 'పరిశ్రమ డిమాండ్లను చూడండి',
    allTab: 'అన్నీ',
    matchingTab: 'సరిపోలడం',
    noDemands: 'డిమాండ్లు లేవు',
    checkLater: 'తర్వాత తనిఖీ చేయండి',
    noMatching: 'సరిపోలికలు లేవు',
    noMatchingDesc: 'పంట పోస్ట్ చేయండి',
    contact: 'సంప్రదించండి',
    deadline: 'చివరి తేదీ',
    matchingBadge: 'మీ ఉత్పత్తులకు సరిపోతుంది'
  }
};

export function AllDemands({ userData, language }: AllDemandsProps) {
  const [allDemands, setAllDemands] = useState<any[]>([]);
  const [matchingDemands, setMatchingDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'matching'>('all');

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchAllDemands();
  }, []);

  const fetchAllDemands = async () => {
    try {
      // Fetch all demands
      const allResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/all-demands`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const allData = await allResponse.json();
      
      if (allData.success) {
        setAllDemands(allData.demands);
      }

      // Get farmer's products from their harvests
      const harvestsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/my-harvests/${userData.id}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const harvestsData = await harvestsResponse.json();
      
      const products = harvestsData.success
        ? [...new Set(harvestsData.harvests.map((h: any) => h.product))]
        : [];

      // Fetch matching demands
      if (products.length > 0) {
        const matchingResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/matching-demands`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              userId: userData.id,
              products,
              district: userData.address?.district || ''
            })
          }
        );

        const matchingData = await matchingResponse.json();
        if (matchingData.success) {
          setMatchingDemands(matchingData.demands);
        }
      }
    } catch (err) {
      console.error('Error fetching demands:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderDemandCard = (demand: any, index: number, isMatching: boolean = false) => (
    <motion.div
      key={demand.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow ${
        isMatching ? 'border-2 border-green-500' : ''
      }`}
    >
      {isMatching && (
        <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-3 py-2">
          <Sparkles className="w-4 h-4 text-green-600" />
          <span className="text-green-700 text-sm">{t.matchingBadge}</span>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-blue-100 rounded-xl p-3">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-800 mb-1">{demand.companyName}</h3>
          <p className="text-gray-600 text-sm mb-3">MRID: {demand.industryMRID}</p>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-4">
            <h4 className="text-blue-800 mb-2">Required: {demand.product}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Package className="w-4 h-4 text-blue-600" />
                Qty: {demand.quantity} kg
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                {demand.priceRange}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                {demand.district}
              </div>
              {demand.deadline && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {new Date(demand.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={() => window.open(`tel:${demand.phone || '1234567890'}`, '_self')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Phone className="w-4 h-4 mr-2" />
            {t.contact}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-800 mb-1">{t.title}</h2>
        <p className="text-gray-600 text-sm">{t.subtitle}</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'matching')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {t.allTab}
            {allDemands.length > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                {allDemands.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="matching" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t.matchingTab}
            {matchingDemands.length > 0 && (
              <span className="ml-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                {matchingDemands.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {allDemands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">{t.noDemands}</h3>
              <p className="text-gray-500 text-sm">{t.checkLater}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {allDemands.map((demand, index) => {
                const isMatching = matchingDemands.some(m => m.id === demand.id);
                return renderDemandCard(demand, index, isMatching);
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matching" className="mt-0">
          {matchingDemands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">{t.noMatching}</h3>
              <p className="text-gray-500 text-sm">{t.noMatchingDesc}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {matchingDemands.map((demand, index) => renderDemandCard(demand, index, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Sprout, Package, MapPin, Phone, IndianRupee, User, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';
import { motion } from 'motion/react';

interface AllHarvestsProps {
  userData: UserData;
  language: Language;
}

const translations = {
  en: {
    title: 'All Harvests',
    subtitle: 'Browse all available harvests',
    allTab: 'All Harvests',
    matchingTab: 'Matching',
    noHarvests: 'No harvests available',
    checkLater: 'Check back later for new harvests',
    noMatching: 'No matching harvests',
    noMatchingDesc: 'Post demands to see matching harvests',
    contact: 'Contact',
    farmerName: 'Farmer',
    matchingBadge: 'Matches Your Demands'
  },
  ta: {
    title: 'அனைத்து விளைச்சல்கள்',
    subtitle: 'கிடைக்கும் விளைச்சல்களை பார்க்கவும்',
    allTab: 'அனைத்து',
    matchingTab: 'பொருந்தும்',
    noHarvests: 'விளைச்சல்கள் இல்லை',
    checkLater: 'பின்னர் சரிபார்க்கவும்',
    noMatching: 'பொருத்தங்கள் இல்லை',
    noMatchingDesc: 'கோரிக்கைகளை பதிவிடவும்',
    contact: 'தொடர்பு',
    farmerName: 'விவசாயி',
    matchingBadge: 'உங்கள் கோரிக்கைகளுக்கு பொருந்தும்'
  },
  hi: {
    title: 'सभी फसलें',
    subtitle: 'उपलब्ध फसलें देखें',
    allTab: 'सभी फसलें',
    matchingTab: 'मिलान',
    noHarvests: 'कोई फसल उपलब्ध नहीं',
    checkLater: 'बाद में जांचें',
    noMatching: 'कोई मिलान नहीं',
    noMatchingDesc: 'मांग पोस्ट करें',
    contact: 'संपर्क',
    farmerName: 'किसान',
    matchingBadge: 'आपकी मांगों से मेल'
  },
  kn: {
    title: 'ಎಲ್ಲಾ ಸುಗ್ಗಿಗಳು',
    subtitle: 'ಲಭ್ಯವಿರುವ ಸುಗ್ಗಿಗಳನ್ನು ನೋಡಿ',
    allTab: 'ಎಲ್ಲಾ',
    matchingTab: 'ಹೊಂದಾಣಿಕೆ',
    noHarvests: 'ಸುಗ್ಗಿಗಳಿಲ್ಲ',
    checkLater: 'ನಂತರ ಪರಿಶೀಲಿಸಿ',
    noMatching: 'ಹೊಂದಾಣಿಕೆಯಿಲ್ಲ',
    noMatchingDesc: 'ಬೇಡಿಕೆಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ',
    contact: 'ಸಂಪರ್ಕಿಸಿ',
    farmerName: 'ರೈತ',
    matchingBadge: 'ನಿಮ್ಮ ಬೇಡಿಕೆಗಳಿಗೆ ಹೊಂದಾಣಿಕೆ'
  },
  ml: {
    title: 'എല്ലാ വിളവുകളും',
    subtitle: 'ലഭ്യമായ വിളവുകൾ കാണുക',
    allTab: 'എല്ലാം',
    matchingTab: 'പൊരുത്തം',
    noHarvests: 'വിളവുകളില്ല',
    checkLater: 'പിന്നീട് പരിശോധിക്കുക',
    noMatching: 'പൊരുത്തങ്ങളില്ല',
    noMatchingDesc: 'ആവശ്യങ്ങൾ പോസ്റ്റ് ചെയ്യുക',
    contact: 'ബന്ധപ്പെടുക',
    farmerName: 'കൃഷിക്കാരൻ',
    matchingBadge: 'നിങ്ങളുടെ ആവശ്യങ്ങളുമായി പൊരുത്തപ്പെടുന്നു'
  },
  te: {
    title: 'అన్ని పంటలు',
    subtitle: 'అందుబాటులో ఉన్న పంటలను చూడండి',
    allTab: 'అన్నీ',
    matchingTab: 'సరిపోలడం',
    noHarvests: 'పంటలు లేవు',
    checkLater: 'తర్వాత తనిఖీ చేయండి',
    noMatching: 'సరిపోలికలు లేవు',
    noMatchingDesc: 'డిమాండ్ పోస్ట్ చేయండి',
    contact: 'సంప్రదించండి',
    farmerName: 'రైతు',
    matchingBadge: 'మీ డిమాండ్‌లకు సరిపోతుంది'
  }
};

export function AllHarvests({ userData, language }: AllHarvestsProps) {
  const [allHarvests, setAllHarvests] = useState<any[]>([]);
  const [matchingHarvests, setMatchingHarvests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'matching'>('all');

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchAllHarvests();
  }, []);

  const fetchAllHarvests = async () => {
    try {
      // Fetch all harvests
      const allResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/all-harvests`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const allData = await allResponse.json();
      
      if (allData.success) {
        setAllHarvests(allData.harvests);
      }

      // Get industry's demanded products
      const demandsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/my-demands/${userData.id}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const demandsData = await demandsResponse.json();
      
      const products = demandsData.success
        ? [...new Set(demandsData.demands.map((d: any) => d.product))]
        : [];

      // Fetch matching harvests
      if (products.length > 0) {
        const matchingResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/matching-harvests`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              userId: userData.id,
              products,
              district: userData.location?.district || ''
            })
          }
        );

        const matchingData = await matchingResponse.json();
        if (matchingData.success) {
          setMatchingHarvests(matchingData.harvests);
        }
      }
    } catch (err) {
      console.error('Error fetching harvests:', err);
    } finally {
      setLoading(false);
    }
  };

  const isMatching = (harvestId: string) => {
    return matchingHarvests.some(h => h.id === harvestId);
  };

  const renderHarvestCard = (harvest: any, index: number) => (
    <motion.div
      key={harvest.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        isMatching(harvest.id) && activeTab === 'all' ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {isMatching(harvest.id) && activeTab === 'all' && (
        <div className="bg-blue-500 text-white px-4 py-2 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {t.matchingBadge}
        </div>
      )}
      
      <div className="flex gap-4 p-6">
        <img
          src={harvest.image}
          alt={harvest.product}
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-gray-800 mb-1">{harvest.product}</h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <User className="w-4 h-4" />
                <span>{harvest.farmerName} ({harvest.farmerMRID})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-blue-600">
                <IndianRupee className="w-5 h-5" />
                <span className="text-xl">{harvest.price}</span>
              </div>
              <span className="text-gray-500 text-sm">per quintal</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Package className="w-4 h-4" />
              <span>{harvest.quantity} quintals</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{harvest.location}</span>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.href = `tel:${harvest.phone || userData.phone}`}
            className="w-full bg-blue-600 hover:bg-blue-700"
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
            <Sprout className="w-4 h-4" />
            {t.allTab}
          </TabsTrigger>
          <TabsTrigger value="matching" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t.matchingTab}
            {matchingHarvests.length > 0 && (
              <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                {matchingHarvests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {allHarvests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">{t.noHarvests}</h3>
              <p className="text-gray-500 text-sm">{t.checkLater}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {allHarvests.map((harvest, index) => renderHarvestCard(harvest, index))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matching">
          {matchingHarvests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">{t.noMatching}</h3>
              <p className="text-gray-500 text-sm">{t.noMatchingDesc}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {matchingHarvests.map((harvest, index) => renderHarvestCard(harvest, index))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

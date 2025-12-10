import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, MapPin, IndianRupee, Calendar, Package, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
    subtitle: 'Browse and manage demands',
    allTab: 'All Demands',
    myTab: 'My Demands',
    addDemand: 'Add Demand',
    postNew: 'Post New Demand',
    productRequired: 'Product Required *',
    productPlaceholder: 'e.g., Rice, Wheat, Tomatoes',
    quantity: 'Quantity (kg/ton) *',
    quantityPlaceholder: '1000',
    priceRange: 'Price Range *',
    pricePlaceholder: '₹40-50/kg',
    district: 'District *',
    districtPlaceholder: 'District name',
    deadline: 'Deadline (Optional)',
    postButton: 'Post Demand',
    noDemands: 'No demands available',
    checkLater: 'Check back later',
    noMyDemands: 'No demands posted yet',
    createFirst: 'Create your first demand',
    myBadge: 'Your Demand',
    contactInfo: 'Contact available on your profile'
  },
  ta: {
    title: 'அனைத்து கோரிக்கைகள்',
    subtitle: 'கோரிக்கைகளை பார்க்கவும்',
    allTab: 'அனைத்து',
    myTab: 'எனது கோரிக்கைகள்',
    addDemand: 'கோரிக்கை சேர்க்கவும்',
    postNew: 'புதிய கோரிக்கை',
    productRequired: 'தேவையான பொருள் *',
    productPlaceholder: 'எ.கா., அரிசி, கோதுமை',
    quantity: 'அளவு (கிலோ/டன்) *',
    quantityPlaceholder: '1000',
    priceRange: 'விலை வரம்பு *',
    pricePlaceholder: '₹40-50/கிலோ',
    district: 'மாவட்டம் *',
    districtPlaceholder: 'மாவட்டம்',
    deadline: 'கடைசி நாள்',
    postButton: 'இடுகையிடவும்',
    noDemands: 'கோரிக்கைகள் இல்லை',
    checkLater: 'பின்னர் சரிபார்க்கவும்',
    noMyDemands: 'உங்கள் கோரிக்கைகள் இல்லை',
    createFirst: 'முதல் கோரிக்கையை உருவாக்கவும்',
    myBadge: 'உங்கள் கோரிக்கை',
    contactInfo: 'தொடர்பு தகவல்'
  },
  hi: {
    title: 'सभी मांगें',
    subtitle: 'मांगें देखें और प्रबंधित करें',
    allTab: 'सभी मांगें',
    myTab: 'मेरी मांगें',
    addDemand: 'मांग जोड़ें',
    postNew: 'नई मांग पोस्ट करें',
    productRequired: 'आवश्यक उत्पाद *',
    productPlaceholder: 'जैसे, चावल, गेहूं',
    quantity: 'मात्रा (किलो/टन) *',
    quantityPlaceholder: '1000',
    priceRange: 'मूल्य सीमा *',
    pricePlaceholder: '₹40-50/किलो',
    district: 'जिला *',
    districtPlaceholder: 'जिला नाम',
    deadline: 'अंतिम तिथि',
    postButton: 'पोस्ट करें',
    noDemands: 'कोई मांग नहीं',
    checkLater: 'बाद में जांचें',
    noMyDemands: 'कोई मांग पोस्ट नहीं',
    createFirst: 'पहली मांग बनाएं',
    myBadge: 'आपकी मांग',
    contactInfo: 'संपर्क जानकारी'
  },
  kn: {
    title: 'ಎಲ್ಲಾ ಬೇಡಿಕೆಗಳು',
    subtitle: 'ಬೇಡಿಕೆಗಳನ್ನು ನೋಡಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ',
    allTab: 'ಎಲ್ಲಾ ಬೇಡಿಕೆಗಳು',
    myTab: 'ನನ್ನ ಬೇಡಿಕೆಗಳು',
    addDemand: 'ಬೇಡಿಕೆ ಸೇರಿಸಿ',
    postNew: 'ಹೊಸ ಬೇಡಿಕೆ ಪೋಸ್ಟ್',
    productRequired: 'ಅಗತ್ಯ ಉತ್ಪನ್ನ *',
    productPlaceholder: 'ಉದಾ., ಅಕ್ಕಿ, ಗೋಧಿ',
    quantity: 'ಪ್ರಮಾಣ (ಕೆಜಿ/ಟನ್) *',
    quantityPlaceholder: '1000',
    priceRange: 'ಬೆಲೆ ವ್ಯಾಪ್ತಿ *',
    pricePlaceholder: '₹40-50/ಕೆಜಿ',
    district: 'ಜಿಲ್ಲೆ *',
    districtPlaceholder: 'ಜಿಲ್ಲೆ ಹೆಸರು',
    deadline: 'ಅಂತಿಮ ದಿನಾಂಕ',
    postButton: 'ಪೋಸ್ಟ್ ಮಾಡಿ',
    noDemands: 'ಬೇಡಿಕೆಗಳಿಲ್ಲ',
    checkLater: 'ನಂತರ ಪರಿಶೀಲಿಸಿ',
    noMyDemands: 'ಯಾವುದೇ ಬೇಡಿಕೆ ಇಲ್ಲ',
    createFirst: 'ಮೊದಲ ಬೇಡಿಕೆ ರಚಿಸಿ',
    myBadge: 'ನಿಮ್ಮ ಬೇಡಿಕೆ',
    contactInfo: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ'
  },
  ml: {
    title: 'എല്ലാ ആവശ്യങ്ങളും',
    subtitle: 'ആവശ്യങ്ങൾ കാണുകയും കൈകാര്യം ചെയ്യുകയും ചെയ്യുക',
    allTab: 'എല്ലാ ആവശ്യങ്ങളും',
    myTab: 'എന്റെ ആവശ്യങ്ങൾ',
    addDemand: 'ആവശ്യം ചേർക്കുക',
    postNew: 'പുതിയ ആവശ്യം പോസ്റ്റ് ചെയ്യുക',
    productRequired: 'ആവശ്യമായ ഉൽപ്പന്നം *',
    productPlaceholder: 'ഉദാ., അരി, ഗോതമ്പ്',
    quantity: 'അളവ് (കിലോ/ടൺ) *',
    quantityPlaceholder: '1000',
    priceRange: 'വില പരിധി *',
    pricePlaceholder: '₹40-50/കിലോ',
    district: 'ജില്ല *',
    districtPlaceholder: 'ജില്ല പേര്',
    deadline: 'അവസാന തീയതി',
    postButton: 'പോസ്റ്റ് ചെയ്യുക',
    noDemands: 'ആവശ്യങ്ങളില്ല',
    checkLater: 'പിന്നീട് പരിശോധിക്കുക',
    noMyDemands: 'ആവശ്യങ്ങളൊന്നുമില്ല',
    createFirst: 'ആദ്യ ആവശ്യം സൃഷ്ടിക്കുക',
    myBadge: 'നിങ്ങളുടെ ആവശ്യം',
    contactInfo: 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ'
  },
  te: {
    title: 'అన్ని డిమాండ్లు',
    subtitle: 'డిమాండ్లను చూడండి మరియు నిర్వహించండి',
    allTab: 'అన్ని డిమాండ్లు',
    myTab: 'నా డిమాండ్లు',
    addDemand: 'డిమాండ్ జోడించండి',
    postNew: 'కొత్త డిమాండ్ పోస్ట్ చేయండి',
    productRequired: 'అవసరమైన ఉత్పత్తి *',
    productPlaceholder: 'ఉదా., బియ్యం, గోధుమ',
    quantity: 'పరిమాణం (కిలో/టన్ను) *',
    quantityPlaceholder: '1000',
    priceRange: 'ధర పరిధి *',
    pricePlaceholder: '₹40-50/కిలో',
    district: 'జిల్లా *',
    districtPlaceholder: 'జిల్లా పేరు',
    deadline: 'చివరి తేదీ',
    postButton: 'పోస్ట్ చేయండి',
    noDemands: 'డిమాండ్లు లేవు',
    checkLater: 'తర్వాత తనిఖీ చేయండి',
    noMyDemands: 'డిమాండ్లు పోస్ట్ చేయలేదు',
    createFirst: 'మొదటి డిమాండ్ సృష్టించండి',
    myBadge: 'మీ డిమాండ్',
    contactInfo: 'సంప్రదింపు సమాచారం'
  }
};

export function AllDemands({ userData, language }: AllDemandsProps) {
  const [allDemands, setAllDemands] = useState<any[]>([]);
  const [myDemands, setMyDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    priceRange: '',
    district: userData.location?.district || '',
    location: '',
    deadline: ''
  });

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
        // Filter out my demands
        const myDemandsFiltered = allData.demands.filter((d: any) => d.industryId === userData.id);
        setMyDemands(myDemandsFiltered);
      }
    } catch (err) {
      console.error('Error fetching demands:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDemand = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/create-demand`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId: userData.id,
            ...formData,
            deadline: formData.deadline ? new Date(formData.deadline).getTime() : null
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setAllDemands([data.demand, ...allDemands]);
        setMyDemands([data.demand, ...myDemands]);
        setDialogOpen(false);
        setFormData({
          product: '',
          quantity: '',
          priceRange: '',
          district: userData.location?.district || '',
          location: '',
          deadline: ''
        });
      }
    } catch (err) {
      console.error('Error creating demand:', err);
    }
  };

  const renderDemandCard = (demand: any, index: number, isMyDemand: boolean = false) => (
    <motion.div
      key={demand.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow ${
        isMyDemand ? 'border-2 border-blue-500' : ''
      }`}
    >
      {isMyDemand && (
        <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg px-3 py-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 text-sm">{t.myBadge}</span>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 rounded-xl p-3">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-800 mb-1">{demand.companyName}</h3>
          <p className="text-gray-600 text-sm mb-3">MRID: {demand.industryMRID}</p>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-3">
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

          {isMyDemand && (
            <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800">
              {t.contactInfo}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-800 mb-1">{t.title}</h2>
          <p className="text-gray-600 text-sm">{t.subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              {t.addDemand}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t.postNew}</DialogTitle>
              <DialogDescription>
                Fill in the details to post a new demand for products
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.productRequired}</Label>
                <Input
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder={t.productPlaceholder}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.quantity}</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder={t.quantityPlaceholder}
                  />
                </div>
                <div>
                  <Label>{t.priceRange}</Label>
                  <Input
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    placeholder={t.pricePlaceholder}
                  />
                </div>
              </div>
              <div>
                <Label>{t.district}</Label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder={t.districtPlaceholder}
                />
              </div>
              <div>
                <Label>{t.deadline}</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <Button
                onClick={createDemand}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!formData.product || !formData.quantity || !formData.priceRange}
              >
                {t.postButton}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'my')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {t.allTab}
            {allDemands.length > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                {allDemands.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="my" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t.myTab}
            {myDemands.length > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                {myDemands.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {allDemands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">{t.noDemands}</h3>
              <p className="text-gray-500 text-sm">{t.checkLater}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {allDemands.map((demand, index) => {
                const isMyDemand = demand.industryId === userData.id;
                return renderDemandCard(demand, index, isMyDemand);
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-0">
          {myDemands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">{t.noMyDemands}</h3>
              <p className="text-gray-500 text-sm">{t.createFirst}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {myDemands.map((demand, index) => renderDemandCard(demand, index, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

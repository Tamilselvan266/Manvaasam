import { useState, useEffect } from 'react';
import { Building2, Package, MapPin, Phone, IndianRupee, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';
import { motion } from 'motion/react';

interface MatchingDemandsProps {
  userData: UserData;
  language: Language;
}

const translations = {
  en: {
    title: 'Matching Demands',
    subtitle: 'Industries looking for your products',
    noDemands: 'No matching demands',
    checkLater: 'Check back later for new opportunities',
    contact: 'Contact',
    deadline: 'Deadline'
  },
  ta: {
    title: 'பொருந்தும் கோரிக்கைகள்',
    subtitle: 'உங்கள் பொருட்களை தேடும் தொழிற்சாலைகள்',
    noDemands: 'பொருத்தங்கள் இல்லை',
    checkLater: 'பின்னர் சரிபார்க்கவும்',
    contact: 'தொடர்பு',
    deadline: 'கடைசி நாள்'
  }
};

export function MatchingDemands({ userData, language }: MatchingDemandsProps) {
  const [demands, setDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchMatchingDemands();
  }, []);

  const fetchMatchingDemands = async () => {
    try {
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
      const response = await fetch(
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

      const data = await response.json();
      if (data.success) {
        setDemands(data.demands);
      }
    } catch (err) {
      console.error('Error fetching matching demands:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-800 mb-1">{t.title}</h2>
        <p className="text-gray-600 text-sm">{t.subtitle}</p>
      </div>

      {demands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">{t.noDemands}</h3>
          <p className="text-gray-500 text-sm">{t.checkLater}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {demands.map((demand, index) => (
            <motion.div
              key={demand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
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
          ))}
        </div>
      )}
    </div>
  );
}

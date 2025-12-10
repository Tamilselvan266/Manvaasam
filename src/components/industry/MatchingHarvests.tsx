import { useState, useEffect } from 'react';
import { Sprout, Package, MapPin, Phone, IndianRupee, User } from 'lucide-react';
import { Button } from '../ui/button';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';
import { motion } from 'motion/react';

interface MatchingHarvestsProps {
  userData: UserData;
  language: Language;
}

export function MatchingHarvests({ userData, language }: MatchingHarvestsProps) {
  const [harvests, setHarvests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchingHarvests();
  }, []);

  const fetchMatchingHarvests = async () => {
    try {
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
      const response = await fetch(
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

      const data = await response.json();
      if (data.success) {
        setHarvests(data.harvests);
      }
    } catch (err) {
      console.error('Error fetching matching harvests:', err);
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
        <h2 className="text-gray-800 mb-1">Matching Harvests</h2>
        <p className="text-gray-600 text-sm">Farmers offering products you need</p>
      </div>

      {harvests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No matching harvests</h3>
          <p className="text-gray-500 text-sm">Post demands to find matching farmers</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {harvests.map((harvest, index) => (
            <motion.div
              key={harvest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
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
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-green-600" />
                        <span>{harvest.farmerName}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs">MRID: {harvest.farmerMRID}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Package className="w-4 h-4 text-green-600" />
                        {harvest.quantity} kg
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        ₹{harvest.price}/unit
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {harvest.district}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => window.open(`tel:${harvest.phone || '1234567890'}`, '_self')}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Farmer
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

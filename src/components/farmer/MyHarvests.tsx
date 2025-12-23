import { useState, useEffect } from 'react';
import { Plus, Package, MapPin, IndianRupee, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';
import { motion } from 'motion/react';

interface MyHarvestsProps {
  userData: UserData;
  language: Language;
}

const translations = {
  en: {
    title: 'My Harvests',
    addNew: 'Add New Harvest',
    product: 'Product Name',
    quantity: 'Quantity (kg/ton)',
    price: 'Price per unit (₹)',
    district: 'District',
    location: 'Location Details',
    upload: 'Upload Image',
    create: 'Create Post',
    noHarvests: 'No harvests posted yet',
    createFirst: 'Create your first harvest post to connect with industries'
  },
  ta: {
    title: 'எனது விளைச்சல்',
    addNew: 'புதிய விளைச்சல்',
    product: 'பொருளின் பெயர்',
    quantity: 'அளவு (kg/ton)',
    price: 'விலை (₹)',
    district: 'மாவட்டம்',
    location: 'இடம்',
    upload: 'படம்',
    create: 'உருவாக்கு',
    noHarvests: 'விளைச்சல் இல்லை',
    createFirst: 'முதல் பதிவை உருவாக்கு'
  }
};

export function MyHarvests({ userData, language }: MyHarvestsProps) {
  const [harvests, setHarvests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    price: '',
    district: userData.address?.district || '',
    location: '',
    image: ''
  });

  const t = translations[language] || translations.en;

  useEffect(() => {
    fetchHarvests();
  }, []);

  const fetchHarvests = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/my-harvests/${userData.id}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setHarvests(data.harvests);
      }
    } catch (err) {
      console.error('Error fetching harvests:', err);
    } finally {
      setLoading(false);
    }
  };

  const createHarvest = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/create-harvest`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId: userData.id,
            ...formData,
            image: formData.image || 'https://images.unsplash.com/photo-1630174522686-2432f93a59e6?w=400'
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setHarvests([data.harvest, ...harvests]);
        setDialogOpen(false);
        setFormData({
          product: '',
          quantity: '',
          price: '',
          district: userData.address?.district || '',
          location: '',
          image: ''
        });
      }
    } catch (err) {
      console.error('Error creating harvest:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800">{t.title}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              {t.addNew}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t.addNew}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.product} *</Label>
                <Input
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="e.g., Rice, Wheat, Tomatoes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.quantity} *</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label>{t.price} *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="50"
                  />
                </div>
              </div>
              <div>
                <Label>{t.district} *</Label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="District name"
                />
              </div>
              <div>
                <Label>{t.location}</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Village/City"
                />
              </div>
              <Button
                onClick={createHarvest}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!formData.product || !formData.quantity || !formData.price}
              >
                {t.create}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {harvests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">{t.noHarvests}</h3>
          <p className="text-gray-500 text-sm">{t.createFirst}</p>
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
              <div className="flex gap-4 p-4">
                <img
                  src={harvest.image}
                  alt={harvest.product}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-2">{harvest.product}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {harvest.quantity} kg
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {harvest.price}/unit
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {harvest.district}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs ${
                    harvest.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {harvest.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

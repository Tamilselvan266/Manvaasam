import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, MapPin, IndianRupee, Calendar, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';
import { motion } from 'motion/react';

interface MyDemandsProps {
  userData: UserData;
  language: Language;
}

export function MyDemands({ userData, language }: MyDemandsProps) {
  const [demands, setDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    priceRange: '',
    district: userData.location?.district || '',
    location: '',
    deadline: ''
  });

  useEffect(() => {
    fetchDemands();
  }, []);

  const fetchDemands = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/my-demands/${userData.id}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setDemands(data.demands);
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
        setDemands([data.demand, ...demands]);
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

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800">My Demands</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Demand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Post New Demand</DialogTitle>
              <DialogDescription>
                Post your product requirements to find matching farmers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Product Required *</Label>
                <Input
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="e.g., Rice, Wheat, Tomatoes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantity (kg/ton) *</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label>Price Range *</Label>
                  <Input
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    placeholder="₹40-50/kg"
                  />
                </div>
              </div>
              <div>
                <Label>District *</Label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="District name"
                />
              </div>
              <div>
                <Label>Deadline (Optional)</Label>
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
                Post Demand
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {demands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 mb-2">No demands posted yet</h3>
          <p className="text-gray-500 text-sm">Create your first demand to find matching farmers</p>
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
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-xl p-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-800 mb-3">{demand.product}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      Qty: {demand.quantity} kg
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-blue-600" />
                      {demand.priceRange}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {demand.district}
                    </div>
                    {demand.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(demand.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs ${
                    demand.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {demand.status}
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
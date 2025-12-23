import { useState, useEffect } from 'react';
import { Plus, ShoppingBag, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';

interface IndustryRecordsProps {
  userData: UserData;
  language: Language;
}

export function IndustryRecords({ userData, language }: IndustryRecordsProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/records/${userData.id}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  const addRecord = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-cdee3b08/add-record`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId: userData.id,
            type: 'purchase',
            ...formData
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setRecords([data.record, ...records]);
        setDialogOpen(false);
        setFormData({ amount: '', description: '' });
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  const totalPurchases = records.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const monthlyPurchases = records.filter(r => {
    const recordDate = new Date(r.date);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
  }).reduce((sum, r) => sum + parseFloat(r.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800">Purchase Records</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Purchase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Purchase Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Purchased wheat from Farmer XYZ"
                />
              </div>
              <Button onClick={addRecord} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm">Total Purchases</span>
          </div>
          <div className="text-2xl text-gray-800">₹{totalPurchases.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">This Month</span>
          </div>
          <div className="text-2xl">₹{monthlyPurchases.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-gray-800 mb-4">Purchase History</h3>
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-800">{record.description}</div>
                  <div className="text-gray-500 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-blue-600">₹{parseFloat(record.amount).toFixed(2)}</div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="text-center py-8 text-gray-500">No purchase records yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

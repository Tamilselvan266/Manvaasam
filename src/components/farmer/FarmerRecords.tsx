import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Language, UserData } from '../../App';

interface FarmerRecordsProps {
  userData: UserData;
  language: Language;
}

export function FarmerRecords({ userData, language }: FarmerRecordsProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'profit',
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
            ...formData
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setRecords([data.record, ...records]);
        setDialogOpen(false);
        setFormData({ type: 'profit', amount: '', description: '' });
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  const totalProfit = records.filter(r => r.type === 'profit').reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const totalLoss = records.filter(r => r.type === 'loss').reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const netProfit = totalProfit - totalLoss;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-800">Records</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit">Profit</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  placeholder="e.g., Sold wheat to ABC Industries"
                />
              </div>
              <Button onClick={addRecord} className="w-full bg-green-600 hover:bg-green-700">
                Add Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Profit</span>
          </div>
          <div className="text-2xl text-gray-800">₹{totalProfit.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm">Loss</span>
          </div>
          <div className="text-2xl text-gray-800">₹{totalLoss.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="w-5 h-5" />
            <span className="text-sm">Net</span>
          </div>
          <div className="text-2xl">₹{netProfit.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-gray-800 mb-4">Transaction History</h3>
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                {record.type === 'profit' ? (
                  <div className="bg-green-100 rounded-full p-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="bg-red-100 rounded-full p-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                )}
                <div>
                  <div className="text-gray-800">{record.description}</div>
                  <div className="text-gray-500 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className={`${record.type === 'profit' ? 'text-green-600' : 'text-red-600'}`}>
                {record.type === 'profit' ? '+' : '-'}₹{parseFloat(record.amount).toFixed(2)}
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="text-center py-8 text-gray-500">No records yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

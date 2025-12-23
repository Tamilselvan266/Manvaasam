import { Building2, User, MapPin, Phone, CreditCard, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Language, UserData } from '../../App';

interface IndustryProfileProps {
  userData: UserData;
  language: Language;
}

export function IndustryProfile({ userData, language }: IndustryProfileProps) {
  return (
    <div>
      <h2 className="text-gray-800 mb-6">Company Profile</h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <img src={userData.photo} alt={userData.companyName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">{userData.companyName}</h3>
              <div className="text-white/80 text-sm mb-3">MRID: {userData.mrid}</div>
              <Badge className="bg-white/20 text-white hover:bg-white/30">Verified Industry</Badge>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 py-3 border-b">
            <div className="bg-blue-100 rounded-full p-3">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Company Name</div>
              <div className="text-gray-800">{userData.companyName}</div>
            </div>
          </div>

          {userData.industryType && (
            <div className="flex items-center gap-4 py-3 border-b">
              <div className="bg-blue-100 rounded-full p-3">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-gray-500 text-sm">Industry Type</div>
                <div className="text-gray-800">{userData.industryType}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 py-3 border-b">
            <div className="bg-blue-100 rounded-full p-3">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Owner Name</div>
              <div className="text-gray-800">{userData.ownerName}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 border-b">
            <div className="bg-blue-100 rounded-full p-3">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Phone Number</div>
              <div className="text-gray-800">{userData.phone}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 border-b">
            <div className="bg-blue-100 rounded-full p-3">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Location</div>
              <div className="text-gray-800">
                {userData.location?.city && `${userData.location.city}, `}
                {userData.location?.district}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3 border-b">
            <div className="bg-blue-100 rounded-full p-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Aadhaar</div>
              <div className="text-gray-800">XXXX XXXX {userData.aadhaar?.slice(-4)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-3">
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Member Since</div>
              <div className="text-gray-800">
                {new Date(userData.createdAt).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6">
        <h3 className="text-blue-800 mb-3">Account Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <div className="text-gray-500 text-sm mb-1">Total Demands</div>
            <div className="text-2xl text-gray-800">{userData.demands?.length || 0}</div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-gray-500 text-sm mb-1">Active Posts</div>
            <div className="text-2xl text-gray-800">{userData.demands?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

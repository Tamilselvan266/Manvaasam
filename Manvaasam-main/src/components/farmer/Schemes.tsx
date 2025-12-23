import { ExternalLink, FileText, IndianRupee, Users } from 'lucide-react';
import { Button } from '../ui/button';
import type { Language } from '../../App';

interface SchemesProps {
  userType: 'farmer' | 'industry';
  language: Language;
}

const farmerSchemes = [
  {
    title: 'PM-KISAN',
    description: 'Direct income support of ₹6,000 per year to farmer families',
    amount: '₹6,000/year',
    link: 'https://pmkisan.gov.in/'
  },
  {
    title: 'Kisan Credit Card',
    description: 'Easy credit facility for farming needs',
    amount: 'Up to ₹3 Lakhs',
    link: 'https://www.india.gov.in/spotlight/kisan-credit-card-kcc-scheme'
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance for farmers against crop loss',
    amount: 'Premium 2%',
    link: 'https://pmfby.gov.in/'
  },
  {
    title: 'Soil Health Card Scheme',
    description: 'Free soil testing and recommendations',
    amount: 'Free',
    link: 'https://soilhealth.dac.gov.in/'
  }
];

const industrySchemes = [
  {
    title: 'Make in India',
    description: 'Manufacturing incentives and support',
    amount: 'Varies',
    link: 'https://www.makeinindia.com/'
  },
  {
    title: 'MSME Support',
    description: 'Financial and technical support for MSMEs',
    amount: 'Up to ₹10 Cr',
    link: 'https://msme.gov.in/'
  },
  {
    title: 'Food Processing Schemes',
    description: 'Support for food processing industries',
    amount: '35% subsidy',
    link: 'https://mofpi.gov.in/'
  },
  {
    title: 'Export Promotion',
    description: 'Incentives for export-oriented businesses',
    amount: 'Tax benefits',
    link: 'https://www.india.gov.in/'
  }
];

export function Schemes({ userType, language }: SchemesProps) {
  const schemes = userType === 'farmer' ? farmerSchemes : industrySchemes;

  return (
    <div>
      <h2 className="text-gray-800 mb-6">Government Schemes</h2>

      <div className="grid gap-4">
        {schemes.map((scheme, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`${userType === 'farmer' ? 'bg-green-100' : 'bg-blue-100'} rounded-xl p-3`}>
                <FileText className={`w-6 h-6 ${userType === 'farmer' ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 mb-2">{scheme.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{scheme.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{scheme.amount}</span>
                  </div>
                  <Button
                    onClick={() => window.open(scheme.link, '_blank')}
                    variant="outline"
                    size="sm"
                    className={`${userType === 'farmer' ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${userType === 'farmer' ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-2xl shadow-md p-6 mt-6`}>
        <div className="flex items-start gap-4">
          <Users className={`w-6 h-6 ${userType === 'farmer' ? 'text-green-600' : 'text-blue-600'} flex-shrink-0`} />
          <div>
            <h3 className={`${userType === 'farmer' ? 'text-green-800' : 'text-blue-800'} mb-2`}>Need Help?</h3>
            <p className="text-gray-700 text-sm mb-3">
              Contact your local agriculture/industry department for detailed information and application process.
            </p>
            <p className="text-gray-600 text-xs">
              Toll-free: 1800-180-1551 (Kisan Call Centre)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

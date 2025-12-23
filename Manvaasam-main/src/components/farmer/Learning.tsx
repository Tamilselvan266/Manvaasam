import { Play, BookOpen, FileText, Video } from 'lucide-react';
import { Button } from '../ui/button';
import type { Language } from '../../App';

interface LearningProps {
  userType: 'farmer' | 'industry';
  language: Language;
}

const farmerResources = [
  {
    title: 'Modern Farming Techniques',
    type: 'Video',
    duration: '15 min',
    thumbnail: 'https://images.unsplash.com/photo-1630174522686-2432f93a59e6?w=400',
    description: 'Learn about drip irrigation and organic farming'
  },
  {
    title: 'Crop Disease Management',
    type: 'Video',
    duration: '20 min',
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    description: 'Identify and treat common crop diseases'
  },
  {
    title: 'Soil Health Management',
    type: 'Article',
    duration: '10 min read',
    thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400',
    description: 'Maintain and improve soil quality'
  },
  {
    title: 'Post-Harvest Storage',
    type: 'Guide',
    duration: '12 min read',
    thumbnail: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400',
    description: 'Best practices for storing harvested crops'
  }
];

const industryResources = [
  {
    title: 'Supply Chain Optimization',
    type: 'Video',
    duration: '18 min',
    thumbnail: 'https://images.unsplash.com/photo-1640895319305-eefa90492a91?w=400',
    description: 'Improve efficiency in agricultural supply chains'
  },
  {
    title: 'Quality Control Standards',
    type: 'Article',
    duration: '15 min read',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    description: 'Industry standards for agricultural products'
  },
  {
    title: 'Contract Farming Guide',
    type: 'Guide',
    duration: '20 min read',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    description: 'Build successful partnerships with farmers'
  }
];

export function Learning({ userType, language }: LearningProps) {
  const resources = userType === 'farmer' ? farmerResources : industryResources;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return Video;
      case 'Article':
        return FileText;
      case 'Guide':
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  return (
    <div>
      <h2 className="text-gray-800 mb-6">Learning Resources</h2>

      <div className="grid gap-6">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-4">
              <div className="relative w-48 h-36 flex-shrink-0">
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
                {resource.type === 'Video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-full p-3">
                      <Play className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-gray-800">{resource.title}</h3>
                  {(() => {
                    const Icon = getTypeIcon(resource.type);
                    return (
                      <div className={`${userType === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} rounded-full px-3 py-1 text-xs flex items-center gap-1`}>
                        <Icon className="w-3 h-3" />
                        {resource.type}
                      </div>
                    );
                  })()}
                </div>

                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{resource.duration}</span>
                  <Button
                    size="sm"
                    className={`${userType === 'farmer' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {resource.type === 'Video' ? 'Watch Now' : 'Read Now'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${userType === 'farmer' ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-2xl shadow-md p-6 mt-6`}>
        <h3 className={`${userType === 'farmer' ? 'text-green-800' : 'text-blue-800'} mb-3`}>📚 More Resources</h3>
        <p className="text-gray-700 text-sm mb-4">
          Access thousands of educational videos, articles, and guides to improve your agricultural knowledge.
        </p>
        <Button
          variant="outline"
          className={`${userType === 'farmer' ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
        >
          Explore All Resources
        </Button>
      </div>
    </div>
  );
}

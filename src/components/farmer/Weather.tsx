import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react';
import type { Language, UserData } from '../../App';

interface WeatherProps {
  userData: UserData;
  language: Language;
}

export function Weather({ userData, language }: WeatherProps) {
  // Mock weather data - in production, use OpenWeatherMap or similar API
  const weatherData = {
    location: userData.address?.district || 'Your District',
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Mon', temp: 29, icon: Sun, condition: 'Sunny' },
      { day: 'Tue', temp: 27, icon: CloudRain, condition: 'Rain' },
      { day: 'Wed', temp: 26, icon: CloudRain, condition: 'Rain' },
      { day: 'Thu', temp: 28, icon: Cloud, condition: 'Cloudy' },
      { day: 'Fri', temp: 30, icon: Sun, condition: 'Sunny' }
    ]
  };

  return (
    <div>
      <h2 className="text-gray-800 mb-6">Weather Forecast</h2>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl shadow-lg p-8 text-white mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-white/80 mb-2">{weatherData.location}</div>
            <div className="text-6xl mb-2">{weatherData.temp}°C</div>
            <div className="text-white/90">{weatherData.condition}</div>
          </div>
          <Cloud className="w-24 h-24 text-white/30" />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5" />
            <div>
              <div className="text-white/70 text-sm">Humidity</div>
              <div>{weatherData.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="w-5 h-5" />
            <div>
              <div className="text-white/70 text-sm">Wind</div>
              <div>{weatherData.windSpeed} km/h</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-gray-800 mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-3">
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 text-center"
            >
              <div className="text-gray-600 text-sm mb-2">{day.day}</div>
              <day.icon className="w-8 h-8 text-sky-600 mx-auto mb-2" />
              <div className="text-gray-800 mb-1">{day.temp}°C</div>
              <div className="text-gray-500 text-xs">{day.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Farming Tips */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md p-6 mt-6">
        <h3 className="text-green-800 mb-3">💡 Farming Tips</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-600">•</span>
            <span>Rain expected Tuesday - good time for planting</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">•</span>
            <span>Monitor soil moisture levels during sunny days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">•</span>
            <span>Apply fertilizers before the rain for better absorption</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

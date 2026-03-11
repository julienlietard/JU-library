import React from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-global-context.css';

/* ── Types ── */

export type JUSkyCondition = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';

export type JUAirQualityLevel = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

export interface JUWeatherData {
  /** Temperature in °C */
  temperature: number;
  /** Sky condition */
  condition: JUSkyCondition;
  /** Humidity percentage (0-100) */
  humidity?: number;
  /** Location label */
  location?: string;
}

export interface JUAirQualityData {
  /** AQI index (0-500) */
  index: number;
  /** Quality level */
  level: JUAirQualityLevel;
  /** Custom label override (e.g. "PM2.5 eleve") */
  label?: string;
}

export interface JUGlobalContextProps {
  /** Weather data */
  weather: JUWeatherData;
  /** Air quality data */
  airQuality: JUAirQualityData;
  /** Additional CSS class */
  className?: string;
}

/* ── Sky icons (minimalist stroke) ── */

const SkyIcon: React.FC<{ condition: JUSkyCondition }> = ({ condition }) => {
  const props = { width: 32, height: 32, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (condition) {
    case 'clear':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case 'partly-cloudy':
      return (
        <svg {...props}>
          <circle cx="10" cy="8" r="3" />
          <path d="M10 2v1.5M4.64 4.64l1.06 1.06M2 8h1.5M4.64 11.36l1.06-1.06" />
          <path d="M8 16h8a4 4 0 100-8 1 1 0 00-1 .08A5 5 0 008 13v3z" />
        </svg>
      );
    case 'cloudy':
      return (
        <svg {...props}>
          <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
        </svg>
      );
    case 'rain':
      return (
        <svg {...props}>
          <path d="M16 13V4a4 4 0 00-8 0" />
          <path d="M18 10h-1.26A8 8 0 109 16h9a5 5 0 000-10z" />
          <path d="M8 19v2M12 19v2M16 19v2" />
        </svg>
      );
    case 'storm':
      return (
        <svg {...props}>
          <path d="M18 10h-1.26A8 8 0 109 16h9a5 5 0 000-10z" />
          <path d="M13 16l-2 4h4l-2 4" />
        </svg>
      );
    case 'snow':
      return (
        <svg {...props}>
          <path d="M18 10h-1.26A8 8 0 109 16h9a5 5 0 000-10z" />
          <circle cx="8" cy="20" r="0.5" fill="currentColor" />
          <circle cx="12" cy="20" r="0.5" fill="currentColor" />
          <circle cx="16" cy="20" r="0.5" fill="currentColor" />
          <circle cx="10" cy="22" r="0.5" fill="currentColor" />
          <circle cx="14" cy="22" r="0.5" fill="currentColor" />
        </svg>
      );
    case 'fog':
      return (
        <svg {...props}>
          <path d="M4 12h16M4 16h12M6 20h10" />
        </svg>
      );
  }
};

const conditionLabels: Record<JUSkyCondition, string> = {
  clear: 'Degage',
  'partly-cloudy': 'Partiellement nuageux',
  cloudy: 'Nuageux',
  rain: 'Pluie',
  storm: 'Orage',
  snow: 'Neige',
  fog: 'Brouillard',
};

const airQualityLabels: Record<JUAirQualityLevel, string> = {
  good: 'Bon',
  moderate: 'Modere',
  unhealthy: 'Mauvais',
  hazardous: 'Dangereux',
};

function isAirBad(level: JUAirQualityLevel): boolean {
  return level === 'unhealthy' || level === 'hazardous';
}

/* ── Component ── */

export const JUGlobalContext: React.FC<JUGlobalContextProps> = ({
  weather,
  airQuality,
  className,
}) => {
  const warn = isAirBad(airQuality.level);

  const classNames = [
    'ju-global-context',
    warn ? 'ju-global-context--warn' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="chat" padding="none" className={classNames}>
      {/* Weather section */}
      <div className="ju-global-context__weather">
        <div className="ju-global-context__sky-icon">
          <SkyIcon condition={weather.condition} />
        </div>

        <div className="ju-global-context__weather-info">
          <span className="ju-global-context__temperature">
            {weather.temperature}°
          </span>
          <span className="ju-global-context__condition">
            {conditionLabels[weather.condition]}
          </span>
        </div>

        {weather.humidity !== undefined && (
          <span className="ju-global-context__humidity">
            {weather.humidity}%
          </span>
        )}
      </div>

      {/* Location */}
      {weather.location && (
        <div className="ju-global-context__location">{weather.location}</div>
      )}

      {/* Divider */}
      <div className="ju-global-context__divider" />

      {/* Air quality section */}
      <div className="ju-global-context__air">
        <div className="ju-global-context__air-header">
          <span className="ju-global-context__air-label">Qualite de l'air</span>
          <span className="ju-global-context__air-index">AQI {airQuality.index}</span>
        </div>

        <div className={`ju-global-context__air-badge ju-global-context__air-badge--${airQuality.level}`}>
          {airQuality.label ?? airQualityLabels[airQuality.level]}
        </div>
      </div>
    </JUCard>
  );
};

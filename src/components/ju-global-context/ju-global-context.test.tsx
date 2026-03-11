import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUGlobalContext } from './ju-global-context';
import type { JUWeatherData, JUAirQualityData } from './ju-global-context';

const goodWeather: JUWeatherData = {
  temperature: 22,
  condition: 'clear',
  humidity: 45,
  location: 'Paris, FR',
};

const goodAir: JUAirQualityData = { index: 32, level: 'good' };

describe('JUGlobalContext', () => {
  it('renders temperature', () => {
    render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(screen.getByText('22°')).toBeInTheDocument();
  });

  it('renders sky condition label', () => {
    render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(screen.getByText('Degage')).toBeInTheDocument();
  });

  it('renders location when provided', () => {
    render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(screen.getByText('Paris, FR')).toBeInTheDocument();
  });

  it('hides location when not provided', () => {
    const weather = { ...goodWeather, location: undefined };
    const { container } = render(<JUGlobalContext weather={weather} airQuality={goodAir} />);
    expect(container.querySelector('.ju-global-context__location')).not.toBeInTheDocument();
  });

  it('renders humidity when provided', () => {
    render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('renders AQI index', () => {
    render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(screen.getByText('AQI 32')).toBeInTheDocument();
  });

  it('renders default air quality label', () => {
    render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(screen.getByText('Bon')).toBeInTheDocument();
  });

  it('renders custom air quality label', () => {
    const air: JUAirQualityData = { index: 160, level: 'unhealthy', label: 'PM2.5 eleve' };
    render(<JUGlobalContext weather={goodWeather} airQuality={air} />);
    expect(screen.getByText('PM2.5 eleve')).toBeInTheDocument();
  });

  it('applies warning class when air quality is unhealthy', () => {
    const air: JUAirQualityData = { index: 160, level: 'unhealthy' };
    const { container } = render(<JUGlobalContext weather={goodWeather} airQuality={air} />);
    expect(container.querySelector('.ju-global-context--warn')).toBeInTheDocument();
  });

  it('applies warning class when air quality is hazardous', () => {
    const air: JUAirQualityData = { index: 310, level: 'hazardous' };
    const { container } = render(<JUGlobalContext weather={goodWeather} airQuality={air} />);
    expect(container.querySelector('.ju-global-context--warn')).toBeInTheDocument();
  });

  it('does not apply warning class when air quality is good', () => {
    const { container } = render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(container.querySelector('.ju-global-context--warn')).not.toBeInTheDocument();
  });

  it('does not apply warning class when air quality is moderate', () => {
    const air: JUAirQualityData = { index: 78, level: 'moderate' };
    const { container } = render(<JUGlobalContext weather={goodWeather} airQuality={air} />);
    expect(container.querySelector('.ju-global-context--warn')).not.toBeInTheDocument();
  });

  it('renders a sky icon SVG', () => {
    const { container } = render(<JUGlobalContext weather={goodWeather} airQuality={goodAir} />);
    expect(container.querySelector('.ju-global-context__sky-icon svg')).toBeInTheDocument();
  });

  it('renders different conditions', () => {
    const conditions = ['clear', 'partly-cloudy', 'cloudy', 'rain', 'storm', 'snow', 'fog'] as const;
    conditions.forEach((condition) => {
      const weather = { ...goodWeather, condition };
      const { container, unmount } = render(<JUGlobalContext weather={weather} airQuality={goodAir} />);
      expect(container.querySelector('.ju-global-context__sky-icon svg')).toBeInTheDocument();
      unmount();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <JUGlobalContext weather={goodWeather} airQuality={goodAir} className="my-class" />,
    );
    expect(container.querySelector('.my-class')).toBeInTheDocument();
  });
});

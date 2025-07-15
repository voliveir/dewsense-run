import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

function calculateDewPoint(tempC: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha); // dew point in Celsius
}

function toFahrenheit(c: number) {
  return c * 9/5 + 32;
}

function getDay(dt: number) {
  const d = new Date(dt * 1000);
  d.setHours(0,0,0,0);
  return d.getTime();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let lat = searchParams.get('lat');
  let lon = searchParams.get('lon');
  const zip = searchParams.get('zip');

  if (!lat || !lon) {
    if (zip) {
      // Use OpenWeather geocoding API to get lat/lon from zip
      const geoUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${OPENWEATHER_KEY}`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) return NextResponse.json({ error: 'Invalid ZIP' }, { status: 400 });
      const geo = await geoRes.json();
      lat = geo.lat;
      lon = geo.lon;
    } else {
      return NextResponse.json({ error: 'Missing coordinates or ZIP' }, { status: 400 });
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error('OpenWeather error:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch forecast', details: text }, { status: 500 });
    }
    const data = await res.json();
    // Group by day, get max dew point per day
    const byDay: Record<number, {dt: number, dew_point: number}[]> = {};
    for (const entry of data.list) {
      const tempF = entry.main.temp;
      const humidity = entry.main.humidity;
      // Convert temp to Celsius for formula
      const tempC = (tempF - 32) * 5/9;
      const dpC = calculateDewPoint(tempC, humidity);
      const dpF = toFahrenheit(dpC);
      const day = getDay(entry.dt);
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push({ dt: entry.dt, dew_point: dpF });
    }
    // For each day, pick the max dew point
    const result = Object.entries(byDay)
      .slice(0, 7)
      .map(([day, arr]) => {
        const max = arr.reduce((a, b) => a.dew_point > b.dew_point ? a : b);
        return { dt: max.dt, dew_point: Math.round(max.dew_point) };
      });
    return NextResponse.json(result);
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
} 
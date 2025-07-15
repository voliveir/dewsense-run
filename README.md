# DewSense Run

A Next.js 14 App Router app that shows runners how muggy their next 7 days will feel, using dew point forecasts.

## Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (custom tokens, dark mode)
- shadcn/ui (Card, Button, Switch)
- lucide-react (icons)
- recharts (optional chart)
- Framer Motion (animations)

## Design Tokens
- Primary accent: `#38bdf8` (sky-500)
- Dew-point comfort palette:
  - Pleasant: `green-400`
  - Comfortable: `lime-400`
  - Getting Sticky: `yellow-400`
  - Uncomfortable: `orange-400`
  - Oppressive: `amber-500`
  - Miserable: `red-500`

## Setup

1. **Install dependencies:**
   ```sh
   pnpm install
   ```
2. **Set up environment variable:**
   - Copy `.env.example` to `.env.local` and add your OpenWeather API key:
     ```sh
     cp .env.example .env.local
     # Edit .env.local and set OPENWEATHER_KEY=YOUR_KEY
     ```
3. **Run the dev server:**
   ```sh
   pnpm dev
   ```

## Features
- Geolocation or ZIP fallback for forecast
- 7-day dew point cards with comfort color
- Responsive, animated, accessible UI
- PWA/mobile-web-app meta tags
- Mock data fallback for local testing

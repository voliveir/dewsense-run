"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { dewPointFeel } from "@/lib/dewPointFeel";
import { MapPin, Sun, Activity, Thermometer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MOCK_URL = "/mocks/forecast.json";

function formatDate(dt: number) {
  return new Date(dt * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getColorHex(tw: string) {
  return {
    "bg-pleasant": "#afe9ff",
    "bg-comfortable": "#a0f0cf",
    "bg-sticky": "#ffe66d",
    "bg-uncomfortable": "#ffb54d",
    "bg-oppressive": "#ff992f",
    "bg-miserable": "#ff4767",
  }[tw] || "#0088ff";
}

export default function Home() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [zipDialog, setZipDialog] = useState(false);
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetch(`/api/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(setForecast)
            .catch(() => fetch(MOCK_URL).then(r => r.json()).then(setForecast))
            .finally(() => setLoading(false));
        },
        () => setZipDialog(true)
      );
    } else {
      setZipDialog(true);
      setLoading(false);
    }
  }, []);

  function handleZipSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    fetch(`/api/forecast?zip=${zip}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setForecast)
      .catch(() => {
        setError("Invalid ZIP or no data.");
        fetch(MOCK_URL).then(r => r.json()).then(setForecast);
      })
      .finally(() => setLoading(false));
    setZipDialog(false);
  }

  return (
    <main className="mx-auto px-4 max-w-[640px] lg:max-w-[960px]">
      {/* Hero */}
      <motion.section
        className="w-full h-[60vh] flex flex-col justify-center items-center rounded-b-3xl shadow-lg mb-8 overflow-hidden relative"
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(120deg, #0088ff 0%, #4bc1ff 100%)",
          backgroundSize: "200% 200%"
        }}
      >
        {/* Droplet line icon (SVG) */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-2" aria-hidden>
          <path d="M20 6C20 6 10 18 10 25C10 31.0751 14.9249 36 21 36C27.0751 36 32 31.0751 32 25C32 18 20 6 20 6Z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-3xl sm:text-5xl font-bold text-white text-center drop-shadow-lg">How Muggy Will My Run Feel?</h1>
        <p className="text-sky-100 text-lg mt-2 text-center">7-day dew-point outlook at a glance.</p>
        <motion.div whileHover={{ scale: 1.08 }}>
          <Button
            className="mt-6 px-6 py-3 text-lg font-semibold flex gap-2 items-center bg-black text-white hover:bg-white hover:text-black transition-colors"
            onClick={() => {
              setZipDialog(false);
              setLoading(true);
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  pos => {
                    fetch(`/api/forecast?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                      .then(r => r.ok ? r.json() : Promise.reject())
                      .then(setForecast)
                      .catch(() => fetch(MOCK_URL).then(r => r.json()).then(setForecast))
                      .finally(() => setLoading(false));
                  },
                  () => setZipDialog(true)
                );
              } else {
                setZipDialog(true);
                setLoading(false);
              }
            }}
          >
            <span role="img" aria-label="location">📍</span> Use My Location
          </Button>
        </motion.div>
      </motion.section>

      {/* ZIP Dialog */}
      {zipDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleZipSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl flex flex-col gap-4 min-w-[300px]">
            <label htmlFor="zip" className="font-semibold">Enter ZIP Code</label>
            <input id="zip" type="text" value={zip} onChange={e => setZip(e.target.value)} className="border rounded px-3 py-2 text-lg" maxLength={10} required pattern="[0-9]{5}" />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">Get Forecast</Button>
          </form>
        </div>
      )}

      {/* Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <AnimatePresence>
          {forecast.map((d, i) => {
            const { label, class: bg, emoji, advice } = dewPointFeel(d.dew_point);
            return (
              <motion.div
                key={d.dt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
              >
                <Card className={`flex flex-col gap-2 ${bg} transition-shadow duration-150`}>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-black/80">{formatDate(d.dt)}</span>
                    <span className="rounded-full bg-white/40 px-2 py-0.5 text-xs uppercase tracking-wide text-black font-semibold flex items-center gap-1" style={{backdropFilter:'blur(2px)'}}>{emoji} {label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-6 h-6 text-black/60" />
                    <span className="text-3xl font-bold text-black drop-shadow-sm">{Math.round(d.dew_point)}°F</span>
                  </div>
                  <div className="text-black/60 text-xs mt-1">{advice}</div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* Chart Section */}
      <div className="flex items-center gap-2 mt-8">
        <Switch checked={showChart} onCheckedChange={setShowChart} id="chart-switch" />
        <label htmlFor="chart-switch" className="text-sm font-medium">Show trend chart</label>
      </div>
      <AnimatePresence>
        {showChart && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={forecast} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="dt" tickFormatter={formatDate} stroke="#334155" fontSize={12} />
                <YAxis stroke="#334155" fontSize={12} domain={[40, 80]} />
                <Tooltip formatter={(v: number) => `${v}°F`} labelFormatter={formatDate} />
                <Bar dataKey="dew_point" radius={[8,8,0,0]} isAnimationActive fill="#0088ff">
                  {forecast.map((d, i) => {
                    const { class: bg } = dewPointFeel(d.dew_point);
                    return <Cell key={i} fill={getColorHex(bg)} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

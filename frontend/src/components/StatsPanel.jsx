import { useEffect, useState } from "react";
import { MapPin, Package, TrendingUp, Loader2 } from "lucide-react";
import { getStats } from "../lib/api.js";

const ICONS = {
  total_items: Package,
  unique_locations: MapPin,
  items_last_7_days: TrendingUp
};

function formatTimestamp(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const payload = await getStats();
      setStats(payload);
    } catch (error) {
      console.warn("Failed to load stats:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const handler = () => loadStats();
    window.addEventListener("app:refresh-data", handler);
    return () => window.removeEventListener("app:refresh-data", handler);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl glass-card p-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border-2 border-red-500/50 bg-red-900/20 p-4 text-lg text-red-200">
        Unable to load stats. Check backend logs.
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col gap-6 rounded-2xl p-7">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">Statistics</h2>
      </div>

      <dl className="grid grid-cols-3 gap-4">
        {["total_items", "unique_locations", "items_last_7_days"].map((key) => {
          const Icon = ICONS[key];
          const labelMap = {
            total_items: "Items Indexed",
            unique_locations: "Unique Locations",
            items_last_7_days: "Added in 7 Days"
          };

          return (
            <div key={key} className="rounded-xl border-2 border-blue-700/20 bg-white/5 p-5 transition-all duration-300 hover:border-blue-600/50 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-800/10 hover:scale-105">
              <dt className="flex items-center gap-2 text-base font-semibold uppercase tracking-wide text-blue-300">
                <Icon className="h-5 w-5" />
                {labelMap[key]}
              </dt>
              <dd className="mt-3 text-4xl font-bold text-white">{stats[key]}</dd>
            </div>
          );
        })}
      </dl>

      <div className="text-base text-blue-200/90 bg-white/5 rounded-xl p-5 border-2 border-blue-700/20">
        <p>
          <span className="font-bold text-white">Last Upload:</span>{" "}
          {formatTimestamp(stats.last_uploaded_at)}
        </p>

        {stats.top_locations.length > 0 && (
          <p className="mt-2">
            <span className="font-bold text-white">Hotspots:</span>{" "}
            {stats.top_locations.map((loc, idx) => (
              <span key={loc.location}>
                {idx > 0 && ", "}
                {loc.location} <span className="text-blue-400/70">({loc.count})</span>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatsPanel;
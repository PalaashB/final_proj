import { useEffect, useState } from "react";
import { Activity, MapPin, Package, TrendingUp, Loader2 } from "lucide-react";
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
      <div className="flex h-full items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-300" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
        Unable to load stats. Check backend logs.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center gap-3">
        <Activity className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold text-slate-100">Network Pulse</h2>
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
            <div key={key} className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
              <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Icon className="h-4 w-4 text-emerald-300" />
                {labelMap[key]}
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-emerald-200">{stats[key]}</dd>
            </div>
          );
        })}
      </dl>

      <div className="text-xs text-slate-400">
        <p>
          <span className="font-semibold text-slate-300">Last Upload:</span>{" "}
          {formatTimestamp(stats.last_uploaded_at)}
        </p>

        {stats.top_locations.length > 0 && (
          <p className="mt-1">
            <span className="font-semibold text-slate-300">Hotspots:</span>{" "}
            {stats.top_locations.map((loc, idx) => (
              <span key={loc.location}>
                {idx > 0 && ", "}
                {loc.location} <span className="text-slate-500">({loc.count})</span>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatsPanel;
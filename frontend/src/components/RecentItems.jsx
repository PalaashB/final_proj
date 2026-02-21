import { useEffect, useState } from "react";
import { Clock3, Loader2, MapPin, PackageSearch } from "lucide-react";
import { getRecentItems, API_BASE_URL } from "../lib/api.js";

function RecentItems({ compact = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecent = async () => {
    try {
      const payload = await getRecentItems(compact ? 4 : 8);
      setItems(payload.items || []);
    } catch (error) {
      console.warn("Failed to load recent items:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecent();
    const handler = () => loadRecent();
    window.addEventListener("echolocator:refresh-data", handler);
    return () => window.removeEventListener("echolocator:refresh-data", handler);
  }, [compact]);

  return (
    <div className={`rounded-3xl border border-slate-800 bg-slate-900/60 ${compact ? "p-5" : "p-8"}`}>
      <div className="mb-4 flex items-center gap-3">
        <Clock3 className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold text-slate-100">
          {compact ? "Latest Uploads" : "Recently Indexed Items"}
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
          Syncing with network…
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <PackageSearch className="h-4 w-4 text-slate-500" />
          No items ingested yet.
        </div>
      ) : (
        <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
          {items.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 transition hover:border-emerald-300/60"
            >
              {item.image_url ? (
                <img
                  src={`${API_BASE_URL}${item.image_url}`}
                  alt={item.title}
                  className="h-20 w-20 flex-none rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-900 text-slate-500">
                  <PackageSearch className="h-6 w-6" />
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{item.description}</p>
                )}
                <div className="mt-auto flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-3 w-3 text-emerald-300" />
                  {item.location || "Location unavailable"}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentItems;
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
    <div className={`glass-card rounded-xl ${compact ? "p-5" : "p-6"}`}>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">
          {compact ? "Latest Finds" : "Recently Added"}
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-blue-300">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
          Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-blue-300/70">
          <PackageSearch className="h-4 w-4 text-blue-400/50" />
          No items yet.
        </div>
      ) : (
        <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
          {items.map((item) => (
            <article
              key={item.id}
              className="flex gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-blue-400/30 hover:bg-white/10"
            >
              {item.image_url ? (
                <img
                  src={`${API_BASE_URL}${item.image_url}`}
                  alt={item.title}
                  className="h-16 w-16 flex-none rounded-lg object-cover border border-white/10"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800/60 text-blue-300/50 border border-white/10">
                  <PackageSearch className="h-6 w-6" />
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-blue-200/80">{item.description}</p>
                )}
                <div className="mt-auto flex items-center gap-1 text-xs text-blue-300/70">
                  <MapPin className="h-3 w-3 text-blue-400" />
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
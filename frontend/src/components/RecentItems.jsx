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
    <div className={`glass-card rounded-2xl ${compact ? "p-6" : "p-7"}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#F5E6D3]">
          {compact ? "Latest Finds" : "Recently Added"}
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-lg text-[#F5E6D3]/80">
          <Loader2 className="h-5 w-5 animate-spin text-[#FF8C42]" />
          Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center gap-2 text-lg text-[#F5E6D3]/70">
          <PackageSearch className="h-5 w-5 text-[#FF8C42]/50" />
          No items yet.
        </div>
      ) : (
        <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
          {items.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-xl border-2 border-[#F5E6D3]/20 bg-[#F5E6D3]/5 p-4 transition-all duration-300 hover:border-[#FF8C42]/50 hover:bg-[#F5E6D3]/10 hover:shadow-xl"
            >
              {item.image_url ? (
                <img
                  src={`${API_BASE_URL}${item.image_url}`}
                  alt={item.title}
                  className="h-18 w-18 flex-none rounded-lg object-cover border-2 border-[#F5E6D3]/30 shadow-md"
                />
              ) : (
                <div className="flex h-18 w-18 items-center justify-center rounded-lg bg-[#143A2F] text-[#F5E6D3]/50 border-2 border-[#F5E6D3]/30">
                  <PackageSearch className="h-6 w-6" />
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <h3 className="text-lg font-bold text-[#F5E6D3]">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-base text-[#F5E6D3]/90">{item.description}</p>
                )}
                <div className="mt-auto flex items-center gap-1 text-base text-[#F5E6D3]/80">
                  <MapPin className="h-4 w-4 text-[#FF8C42]" />
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
import { useState } from "react";
import { Search, Loader2, AlertTriangle, Compass } from "lucide-react";
import { searchItems, API_BASE_URL } from "../lib/api.js";

function formatDate(isoString) {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

function ResearchForm() {
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(0.6);
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setError("");
    setResults([]);

    try {
      const payload = await searchItems({
        query,
        threshold,
        topK: 12,
        location: location.trim() || undefined
      });
      setResults(payload.results || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-emerald-200">Find My Lost Item</h2>
      <p className="mt-1 text-sm text-slate-400">
        Describe it the way you remember it. The CLIP embedding closes the vocabulary gap between how the finder tagged
        it and how you search for it.
      </p>

      <form onSubmit={handleSearch} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300">Semantic description</label>
          <div className="mt-2 flex rounded-full border border-slate-800 bg-slate-950/60 pr-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g. "green hydroflask with robotics stickers"'
              className="flex-1 rounded-full bg-transparent px-5 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {searching ? "Searching…" : "Search"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="flex items-center justify-between text-sm text-slate-400">
              <span>Similarity threshold (cos ≥ {threshold.toFixed(2)})</span>
              <span className="font-semibold text-emerald-200">{Math.round(threshold * 100)}%</span>
            </label>
            <input
              type="range"
              min={0.3}
              max={0.95}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400">Filter by location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Library, Engineering Building"
              className="mt-2 w-full rounded-full border border-slate-800 bg-slate-950/60 px-5 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {!searching && !error && results.length === 0 && query.trim() !== "" && (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center text-slate-400">
          <Compass className="mx-auto h-8 w-8 text-emerald-300" />
          <p className="mt-3 font-semibold text-slate-200">No matches above the threshold yet.</p>
          <p className="mt-1 text-sm">Try lowering the similarity slider or rephrasing your description.</p>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {results.map((item) => {
          const matchPercent = Math.round((item.similarity ?? 0) * 100);
          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 shadow-lg shadow-black/20 transition hover:border-emerald-300/60 hover:shadow-emerald-500/20"
            >
              {item.image_url && (
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}${item.image_url}`}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {matchPercent}% match
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-400">
                  {item.location && (
                    <p>
                      <span className="font-semibold text-slate-300">Found at:</span> {item.location}
                    </p>
                  )}
                  {item.finder_contact && (
                    <p>
                      <span className="font-semibold text-slate-300">Contact:</span> {item.finder_contact}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold text-slate-300">Logged:</span>{" "}
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="mt-auto h-2 w-full overflow-hidden rounded-full bg-slate-800/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                    style={{ width: `${matchPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {searching && (
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
          Vector search in progress…
        </div>
      )}
    </div>
  );
}

export default ResearchForm;
import { useState } from "react";
import { Search, Loader2, AlertTriangle, Compass } from "lucide-react";
import { searchItems, API_BASE_URL } from "../lib/api.js";

const LOCATIONS = [
  'W.E.B. Du Bois Library',
  'Berkshire Dining Commons',
  'Worcester Dining Commons',
  'Hampshire Dining Commons',
  'Franklin Dining Commons',
  'Lederle Graduate Research Center',
  'Integrated Learning Center',
  'Student Union',
  'Rec Center',
  'South College',
  'Morrill Science Center'
];

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
      <h2 className="text-2xl font-bold text-slate-900">Find Your Lost Item</h2>
      <p className="mt-2 text-sm text-slate-600">
        Describe what you're looking for.
      </p>

      <form onSubmit={handleSearch} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search description</label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g. "black bottle with robotics stickers"'
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              {searching ? "Searching…" : "Search"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="flex items-center justify-between text-sm text-slate-700 mb-2">
              <span className="font-medium">Similarity threshold</span>
              <span className="font-semibold text-blue-600">{Math.round(threshold * 100)}%</span>
            </label>
            <input
              type="range"
              min={0.3}
              max={0.95}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-2 w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 font-medium mb-2">Location filter (optional)</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
            >
              <option value="">All locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {!searching && !error && results.length === 0 && query.trim() !== "" && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <Compass className="mx-auto h-10 w-10 text-blue-500 mb-3" />
          <p className="font-medium text-slate-900">No matches found.</p>
          <p className="mt-1 text-sm text-slate-600">Try adjusting the similarity threshold.</p>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {results.map((item) => {
          const matchPercent = Math.round((item.similarity ?? 0) * 100);
          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-all hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
            >
              {item.image_url && (
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={`${API_BASE_URL}${item.image_url}`}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 right-3 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    {matchPercent}% match
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  {item.location && (
                    <p>
                      <span className="font-semibold text-slate-900">Found at:</span> {item.location}
                    </p>
                  )}
                  {item.finder_contact && (
                    <p>
                      <span className="font-semibold text-slate-900">Contact:</span> {item.finder_contact}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold text-slate-900">Logged:</span>{" "}
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="mt-auto h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${matchPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {searching && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-blue-200">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
          Vector search in progress…
        </div>
      )}
    </div>
  );
}

export default ResearchForm;
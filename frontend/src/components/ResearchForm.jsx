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
      <h2 className="text-4xl font-bold text-[#1B4D3E]">Find Your Lost Item</h2>
      <p className="mt-3 text-lg text-[#143A2F]">
        Describe what you're looking for.
      </p>

      <form onSubmit={handleSearch} className="mt-8 space-y-6">
        <div>
          <label className="block text-lg font-semibold text-[#1B4D3E] mb-3">Search description</label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g. "black bottle with robotics stickers"'
              className="flex-1 rounded-xl border-2 border-[#1B4D3E]/30 bg-white px-5 py-4 text-lg text-[#1B4D3E] placeholder:text-[#1B4D3E]/50 focus:border-[#FF8C42] focus:outline-none focus:ring-4 focus:ring-[#FF8C42]/20 transition-all shadow-sm hover:border-[#1B4D3E]/50 hover:shadow-md"
            />
            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF8C42] px-8 py-4 text-lg font-bold text-white shadow-xl shadow-[#FF8C42]/40 transition-all hover:bg-[#FF8C42]/90 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              {searching ? "Searching…" : "Search"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="p-6 rounded-xl bg-[#F5E6D3]/30 border-2 border-[#1B4D3E]/20 shadow-sm">
            <label className="flex items-center justify-between text-lg text-[#1B4D3E] mb-3">
              <span className="font-semibold">Similarity threshold</span>
              <span className="font-bold text-[#FF8C42] text-2xl">{Math.round(threshold * 100)}%</span>
            </label>
            <input
              type="range"
              min={0.3}
              max={0.95}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="mt-2 w-full h-3 bg-[#1B4D3E]/20 rounded-full appearance-none cursor-pointer accent-[#FF8C42]"
            />
          </div>

          <div>
            <label className="block text-lg text-[#1B4D3E] font-semibold mb-3">Location filter</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border-2 border-[#1B4D3E]/30 bg-white px-5 py-4 text-lg text-[#1B4D3E] focus:border-[#FF8C42] focus:outline-none focus:ring-4 focus:ring-[#FF8C42]/20 appearance-none cursor-pointer transition-all shadow-sm hover:border-[#1B4D3E]/50 hover:shadow-md"
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
        <div className="mt-6 flex items-center gap-3 rounded-xl border-2 border-red-600 bg-red-50 px-5 py-4 text-lg font-semibold text-red-900 shadow-lg">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {!searching && !error && results.length === 0 && query.trim() !== "" && (
        <div className="mt-8 rounded-2xl border-2 border-[#1B4D3E]/30 bg-[#F5E6D3]/50 p-8 text-center shadow-lg">
          <Compass className="mx-auto h-12 w-12 text-[#FF8C42] mb-4" />
          <p className="font-bold text-[#1B4D3E] text-2xl">No matches found.</p>
          <p className="mt-2 text-lg text-[#14 3A2F]">Try adjusting the similarity threshold.</p>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {results.map((item) => {
          const matchPercent = Math.round((item.similarity ?? 0) * 100);
          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border-2 border-[#1B4D3E]/30 bg-white shadow-xl transition-all duration-300 hover:border-[#FF8C42] hover:shadow-2xl hover:-translate-y-2"
            >
              {item.image_url && (
                <div className="relative h-56 overflow-hidden bg-[#F5E6D3]/30">
                  <img
                    src={`${API_BASE_URL}${item.image_url}`}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 right-3 rounded-full bg-[#FF8C42] px-4 py-2 text-base font-bold text-white shadow-xl">
                    {matchPercent}% match
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#1B4D3E]">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-lg text-[#14 3A2F] leading-relaxed">{item.description}</p>
                  )}
                </div>

                <div className="space-y-2 text-lg text-[#14 3A2F]">
                  {item.location && (
                    <p>
                      <span className="font-bold text-[#1B4D3E]">Found at:</span> {item.location}
                    </p>
                  )}
                  {item.finder_contact && (
                    <p>
                      <span className="font-bold text-[#1B4D3E]">Contact:</span> {item.finder_contact}
                    </p>
                  )}
                  <p>
                    <span className="font-bold text-[#1B4D3E]">Logged:</span>{" "}
                    {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="mt-auto h-3 w-full overflow-hidden rounded-full bg-[#1B4D3E]/20">
                  <div
                    className="h-full rounded-full bg-[#FF8C42] shadow-sm"
                    style={{ width: `${matchPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {searching && (
        <div className="mt-8 flex items-center justify-center gap-2 text-lg text-[#F5E6D3]">
          <Loader2 className="h-5 w-5 animate-spin text-[#FF8C42]" />
          Vector search in progress…
        </div>
      )}
    </div>
  );
}

export default ResearchForm;
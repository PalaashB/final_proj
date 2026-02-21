import { useEffect, useState } from "react";
import { Search, Upload } from "lucide-react";
import UploadForm from "./components/UploadForm.jsx";
import SearchForm from "./components/SearchForm.jsx";
import RecentItems from "./components/RecentItems.jsx";
import StatsPanel from "./components/StatsPanel.jsx";

const TABS = [
  { id: "search", label: "Locate My Item", icon: Search },
  { id: "upload", label: "Report a Found Item", icon: Upload }
];

function App() {
  const [activeTab, setActiveTab] = useState("search");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && TABS.find((tab) => tab.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <header className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Echo-Locator
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            AI-Powered Lost &amp; Found for Fragmented Campuses
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Replace the physical scavenger hunt with semantic search. Upload once, retrieve everywhere.
          </p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <StatsPanel />
          <RecentItems compact />
        </section>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-emerald-400 bg-emerald-400/10 text-emerald-200 shadow-lg shadow-emerald-500/30"
                    : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-emerald-300/30 hover:text-emerald-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur">
          {activeTab === "search" ? <SearchForm /> : <UploadForm />}
        </section>

        <section className="mt-12">
          <RecentItems />
        </section>

        <footer className="mt-16 text-center text-xs text-slate-500">
          Powered by CLIP ViT-B/32 · SQLite In-Memory Vector Ranking · FastAPI × React
        </footer>
      </div>
    </div>
  );
}

export default App;
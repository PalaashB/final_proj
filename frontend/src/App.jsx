import { useEffect, useState } from "react";
import { Search, Upload } from "lucide-react";
import UploadForm from "./components/UploadForm.jsx";
import ResearchForm from "./components/ResearchForm.jsx";
import RecentItems from "./components/RecentItems.jsx";
import StatsPanel from "./components/StatsPanel.jsx";

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 shadow-lg">
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900">
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
          <path d="M9 11L12 14L22 4" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
    <div>
      <h1 className="text-2xl font-bold text-white">Back2U</h1>
      <p className="text-xs text-blue-300 -mt-0.5">Find what's yours</p>
    </div>
  </div>
);

const TABS = [
  { id: "search", label: "Search for Lost Items", icon: Search },
  { id: "upload", label: "Report Found Item", icon: Upload }
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
        
        {/* Header */}
        <header className="mb-12 text-center animate-fade-in-up">
          <Logo />
          <h2 className="mt-8 text-3xl font-bold text-white" style={{letterSpacing: '0.01em'}}>
            Smart matches. Simple returns.
          </h2>
        </header>

        {/* Tabs - MOVED BEFORE Stats */}
        <div className="mb-10 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "border-blue-400/30 bg-white/5 text-blue-200 hover:border-blue-400/50 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stats Grid */}
        <section className="mb-10 grid gap-4 lg:grid-cols-3 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="lg:col-span-2">
            <StatsPanel />
          </div>
          <div>
            <RecentItems compact />
          </div>
        </section>

        {/* Main Form */}
        <section className="glass rounded-2xl p-8 shadow-xl animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          {activeTab === "search" ? <ResearchForm /> : <UploadForm />}
        </section>

        {/* Recent Items */}
        <section className="mt-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <RecentItems />
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Logo />
            <p className="text-xs text-blue-300/70">
              © 2024 Back2U. Powered by AI semantic search.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
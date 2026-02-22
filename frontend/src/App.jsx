import { useEffect, useState } from "react";
import { Search, Upload } from "lucide-react";
import UploadForm from "./components/UploadForm.jsx";
import ResearchForm from "./components/ResearchForm.jsx";
import RecentItems from "./components/RecentItems.jsx";
import StatsPanel from "./components/StatsPanel.jsx";

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 p-0.5">
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
          <path d="M9 11L12 14L22 4" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
    <div>
      <h1 className="text-3xl font-bold text-white">Back2U</h1>
      <p className="text-sm text-blue-300 -mt-0.5">find what's yours</p>
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
        
        <header className="mb-12 text-center animate-fade-in-up">
          <Logo />
          <h2 className="mt-8 text-5xl font-bold text-white">
            Turning Lost Into Found
          </h2>
        </header>

        <div className="mb-10 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-xl border-2 px-7 py-3.5 text-base font-bold transition-all ${
                  isActive
                    ? "border-blue-700 bg-blue-700 text-white shadow-xl shadow-blue-700/40"
                    : "border-blue-700/30 bg-white/5 text-blue-200 hover:border-blue-600/60 hover:bg-white/10 hover:shadow-lg"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <section className="glass rounded-2xl p-10 shadow-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          {activeTab === "search" ? <ResearchForm /> : <UploadForm />}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-3 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="lg:col-span-2">
            <StatsPanel />
          </div>
          <div>
            <RecentItems compact />
          </div>
        </section>

        <section className="mt-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <RecentItems />
        </section>

        <footer className="mt-16 border-t-2 border-white/10 pt-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <Logo />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
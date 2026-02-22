import { useEffect, useState } from "react";
import { Search, Upload, ChevronDown } from "lucide-react";
import UploadForm from "./components/UploadForm.jsx";
import ResearchForm from "./components/ResearchForm.jsx";
import RecentItems from "./components/RecentItems.jsx";
import StatsPanel from "./components/StatsPanel.jsx";
import HeroSection from "./components/HeroSection.jsx";

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-[#FF8C42] to-[#F5E6D3] p-0.5">
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#1B4D3E]">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
          <path d="M9 11L12 14L22 4" stroke="#F5E6D3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="#FF8C42" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
    <div>
      <h1 className="text-3xl font-bold text-[#F5E6D3]">Back2U</h1>
      <p className="text-sm text-[#F5E6D3]/80 -mt-0.5">find what's yours</p>
    </div>
  </div>
);

const TABS = [
  { id: "search", label: "Search for Lost Items", icon: Search },
  { id: "upload", label: "Report Found Item", icon: Upload }
];

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > 300) {
        setShowContent(true);
      }

      const sections = document.querySelectorAll('.section-fade');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          section.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen">
      <HeroSection />

      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mx-auto max-w-6xl px-4 py-20">
          
          <section className="section-fade mb-20">
            <div className="text-center mb-12">
              <Logo />
            </div>

            <div className="mb-12 flex flex-wrap justify-center gap-5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 rounded-xl border-2 px-8 py-4 text-lg font-bold transition-all ${
                      isActive
                        ? "border-[#FF8C42] bg-[#FF8C42] text-[#1B4D3E] shadow-xl shadow-[#FF8C42]/40"
                        : "border-[#F5E6D3]/30 bg-[#143A2F] text-[#F5E6D3] hover:border-[#FF8C42]/60 hover:bg-[#0D2720] hover:shadow-lg"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="glass rounded-3xl p-12 shadow-2xl">
              {activeTab === "search" ? <ResearchForm /> : <UploadForm />}
            </div>
          </section>

          <section className="section-fade mb-20">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <StatsPanel />
              </div>
              <div>
                <RecentItems compact />
              </div>
            </div>
          </section>

          <section className="section-fade">
            <RecentItems />
          </section>

          <footer className="mt-20 border-t-2 border-[#F5E6D3]/10 pt-10 text-center">
            <div className="flex flex-col items-center gap-4">
              <Logo />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
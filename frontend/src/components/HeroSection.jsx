import { ChevronDown } from "lucide-react";

function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="hero-section relative bg-gradient-to-br from-[#1B4D3E] to-[#143A2F]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-left space-y-6 animate-fade-in-up">
            <h1 className="text-6xl lg:text-7xl font-bold text-[#F5E6D3] leading-tight">
              Lost Something On Campus?
            </h1>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#F5E6D3]/90">
              Let's Help You Find It
            </h2>
            <p className="text-xl text-[#F5E6D3]/80 max-w-xl leading-relaxed">
              Searched every corner of campus? Don't panic! Post, search, or report lost and found items in minutes. Reconnect with what matters.
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={scrollToContent}
                className="btn-glow px-8 py-4 bg-[#F5E6D3] text-[#1B4D3E] rounded-xl text-lg font-bold shadow-xl hover:bg-[#FF8C42] hover:text-white transition-all duration-300"
              >
                Report an Item
              </button>
              <button 
                onClick={scrollToContent}
                className="px-8 py-4 border-2 border-[#FF8C42] text-[#FF8C42] rounded-xl text-lg font-bold hover:bg-[#FF8C42] hover:text-[#1B4D3E] transition-all duration-300"
              >
                Browse Lost Items
              </button>
            </div>
          </div>

          <div className="relative animate-float">
            <svg viewBox="0 0 600 500" className="w-full h-auto">
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#F5E6D3', stopOpacity: 0.3}} />
                  <stop offset="100%" style={{stopColor: '#FF8C42', stopOpacity: 0.2}} />
                </linearGradient>
              </defs>
              
              <ellipse cx="300" cy="250" rx="280" ry="230" fill="url(#bgGradient)" />
              
              <g className="animate-float" style={{animationDelay: '0.2s'}}>
                <rect x="100" y="120" width="60" height="60" rx="8" fill="#FF8C42" opacity="0.8" />
                <rect x="105" y="125" width="50" height="40" rx="4" fill="#F5E6D3" opacity="0.6" />
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.4s'}}>
                <rect x="440" y="80" width="55" height="55" rx="8" fill="#F5E6D3" opacity="0.8" />
                <rect x="445" y="85" width="45" height="35" rx="4" fill="#FF8C42" opacity="0.6" />
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.6s'}}>
                <rect x="420" y="320" width="50" height="50" rx="8" fill="#FF8C42" opacity="0.7" />
                <circle cx="445" cy="345" r="15" fill="#F5E6D3" opacity="0.8" />
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.3s'}}>
                <rect x="130" y="340" width="45" height="45" rx="8" fill="#F5E6D3" opacity="0.7" />
                <rect x="135" y="345" width="35" height="30" rx="4" fill="#FF8C42" opacity="0.6" />
              </g>
              
              <g transform="translate(200, 180)">
                <ellipse cx="0" cy="80" rx="30" ry="15" fill="#0D2720" opacity="0.2" />
                <circle cx="0" cy="0" r="40" fill="#F5E6D3" />
                <circle cx="-10" cy="-5" r="15" fill="#0D2720" />
                <circle cx="10" cy="-5" r="15" fill="#0D2720" />
                <path d="M -15 10 Q 0 20 15 10" stroke="#0D2720" strokeWidth="3" fill="none" strokeLinecap="round" />
                <rect x="-50" y="30" width="100" height="80" rx="10" fill="#FF8C42" />
                <rect x="-40" y="110" width="35" height="60" rx="8" fill="#FF8C42" />
                <rect x="5" y="110" width="35" height="60" rx="8" fill="#FF8C42" />
                <circle cx="-25" cy="60" r="8" fill="#F5E6D3" />
                <circle cx="0" cy="60" r="8" fill="#F5E6D3" />
                <circle cx="25" cy="60" r="8" fill="#F5E6D3" />
                <path d="M -30 -30 L -50 -50 M -35 -25 L -60 -30" stroke="#0D2720" strokeWidth="2" strokeLinecap="round" />
              </g>
              
              <g transform="translate(400, 200)">
                <ellipse cx="0" cy="80" rx="30" ry="15" fill="#0D2720" opacity="0.2" />
                <circle cx="0" cy="0" r="40" fill="#F5E6D3" />
                <circle cx="-10" cy="-5" r="15" fill="#0D2720" />
                <circle cx="10" cy="-5" r="15" fill="#0D2720" />
                <circle cx="-10" cy="-5" r="5" fill="#F5E6D3" />
                <circle cx="10" cy="-5" r="5" fill="#F5E6D3" />
                <ellipse cx="0" cy="15" rx="15" ry="10" fill="#FF8C42" />
                <rect x="-50" y="30" width="100" height="80" rx="10" fill="#143A2F" />
                <rect x="-40" y="110" width="35" height="60" rx="8" fill="#143A2F" />
                <rect x="5" y="110" width="35" height="60" rx="8" fill="#143A2F" />
                <rect x="-35" y="50" width="70" height="40" rx="5" fill="#F5E6D3" />
                <line x1="0" y1="50" x2="0" y2="90" stroke="#0D2720" strokeWidth="2" />
                <line x1="-35" y1="70" x2="35" y2="70" stroke="#0D2720" strokeWidth="2" />
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.5s'}}>
                <circle cx="250" cy="100" r="20" fill="#FF8C42" opacity="0.6" />
                <path d="M 250 85 L 255 95 L 265 95 L 257 102 L 260 112 L 250 105 L 240 112 L 243 102 L 235 95 L 245 95 Z" fill="#F5E6D3" />
              </g>
            </svg>
          </div>

        </div>
      </div>

      <div className="scroll-indicator cursor-pointer" onClick={scrollToContent}>
        <ChevronDown className="h-10 w-10 text-[#FF8C42]" />
      </div>
    </div>
  );
}

export default HeroSection;
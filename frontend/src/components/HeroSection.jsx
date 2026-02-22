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
          
          <div className="text-left space-y-6 animate-fade-in-up lg:pl-20">
            <h1 className="text-6xl lg:text-7xl font-bold text-[#F5E6D3] leading-tight">
              Lost Something On Campus?
            </h1>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#F5E6D3]/90">
              Let's Help You Find It
            </h2>
            <p className="text-xl text-[#F5E6D3]/80 max-w-xl leading-relaxed">
              Searched every corner of campus? Don't panic! Search lost items in seconds. 
            </p>
          </div>

          <div className="relative animate-float">
            <svg viewBox="0 0 600 500" className="w-full h-auto">
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#8B9D91', stopOpacity: 0.6}} />
                  <stop offset="100%" style={{stopColor: '#6B7D71', stopOpacity: 0.5}} />
                </linearGradient>
              </defs>
              
              <ellipse cx="300" cy="250" rx="280" ry="230" fill="url(#bgGradient)" />
              
              <g className="animate-float" style={{animationDelay: '0.2s'}}>
                <rect x="120" y="100" width="50" height="50" rx="8" fill="#FF8C42" opacity="0.8" />
                <text x="145" y="132" fontSize="24" fill="#F5E6D3" textAnchor="middle">📄</text>
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.4s'}}>
                <rect x="430" y="80" width="50" height="50" rx="8" fill="#FF8C42" opacity="0.8" />
                <text x="455" y="112" fontSize="24" fill="#F5E6D3" textAnchor="middle">📦</text>
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.6s'}}>
                <rect x="100" y="350" width="45" height="45" rx="8" fill="#FF8C42" opacity="0.7" />
                <text x="122" y="380" fontSize="20" fill="#F5E6D3" textAnchor="middle">📱</text>
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.3s'}}>
                <rect x="420" y="330" width="50" height="50" rx="8" fill="#FF8C42" opacity="0.7" />
                <text x="445" y="362" fontSize="24" fill="#F5E6D3" textAnchor="middle">💼</text>
              </g>
              
              <g className="animate-float" style={{animationDelay: '0.5s'}}>
                <circle cx="250" cy="100" r="20" fill="#FF8C42" opacity="0.6" />
                <text x="250" y="108" fontSize="20" fill="#F5E6D3" textAnchor="middle">⭐</text>
              </g>

              <g className="animate-float" style={{animationDelay: '0.7s'}}>
                <rect x="480" y="200" width="45" height="45" rx="8" fill="#F5E6D3" opacity="0.3" />
              </g>
              
              <g transform="translate(180, 200)">
                <ellipse cx="0" cy="90" rx="30" ry="12" fill="#0D2720" opacity="0.3" />
                <circle cx="0" cy="0" r="40" fill="#FF8C42" />
                <circle cx="-12" cy="-8" r="8" fill="#0D2720" />
                <circle cx="12" cy="-8" r="8" fill="#0D2720" />
                <circle cx="-12" cy="-8" r="3" fill="#F5E6D3" />
                <circle cx="12" cy="-8" r="3" fill="#F5E6D3" />
                <path d="M -12 8 Q 0 15 12 8" stroke="#0D2720" strokeWidth="3" fill="none" strokeLinecap="round" />
                <rect x="-45" y="35" width="90" height="70" rx="10" fill="#FF8C42" />
                <circle cx="-20" cy="60" r="6" fill="#F5E6D3" />
                <circle cx="0" cy="60" r="6" fill="#F5E6D3" />
                <circle cx="20" cy="60" r="6" fill="#F5E6D3" />
                <rect x="-35" y="105" width="30" height="50" rx="8" fill="#FF8C42" />
                <rect x="5" y="105" width="30" height="50" rx="8" fill="#FF8C42" />
                <g transform="translate(50, -20)">
                  <circle cx="0" cy="0" r="35" fill="none" stroke="#0D2720" strokeWidth="4" />
                  <line x1="25" y1="25" x2="45" y2="45" stroke="#0D2720" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="20" fill="rgba(245, 230, 211, 0.3)" />
                </g>
              </g>
              
              <g transform="translate(420, 220)">
                <ellipse cx="0" cy="90" rx="30" ry="12" fill="#0D2720" opacity="0.3" />
                <circle cx="0" cy="0" r="40" fill="#F5E6D3" />
                <circle cx="-12" cy="-8" r="8" fill="#0D2720" />
                <circle cx="12" cy="-8" r="8" fill="#0D2720" />
                <circle cx="-12" cy="-8" r="3" fill="#FF8C42" />
                <circle cx="12" cy="-8" r="3" fill="#FF8C42" />
                <ellipse cx="0" cy="12" rx="12" ry="8" fill="#FF8C42" />
                <rect x="-45" y="35" width="90" height="70" rx="10" fill="#143A2F" />
                <rect x="-35" y="105" width="30" height="50" rx="8" fill="#143A2F" />
                <rect x="5" y="105" width="30" height="50" rx="8" fill="#143A2F" />
                <g transform="translate(-55, -15)">
                  <circle cx="0" cy="0" r="35" fill="none" stroke="#FF8C42" strokeWidth="4" />
                  <line x1="-25" y1="25" x2="-45" y2="45" stroke="#FF8C42" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="20" fill="rgba(255, 140, 66, 0.3)" />
                </g>
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
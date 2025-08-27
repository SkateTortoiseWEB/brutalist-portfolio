"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Linkedin, Palette } from "lucide-react";
import Image from 'next/image';

export default function BrutalistPortfolio() {
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<"home" | "portfolio" | "about" | "contact" | "instagram">("home");
  const [currentTime, setCurrentTime] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchText, setGlitchText] = useState("SMOKEYXXVII");
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const tracks = [
    { 
      title: "Architecture Music", 
      artist: "Design Sounds",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ];

  // Updated portfolio data with the provided image URLs
  const portfolioItems = [
    {
      id: 1,
      title: "Cross Section",
      year: "2023",
      imageUrl: "https://dl.dropbox.com/scl/fi/cc4l9hl0zbxqyt5rjpppx/cross.jpg?rlkey=xo5ti1buqv36uaxqxujvjd05j&dl=0"
    },
    {
      id: 2,
      title: "Doorway II",
      year: "2023",
      imageUrl: "https://dl.dropbox.com/scl/fi/rzgnu6rlmipxv4s8pks8f/door-2.jpg?rlkey=5gtzegks2olpgi8f8d52tmf5b&dl=0"
    },
    {
      id: 3,
      title: "Entryway",
      year: "2022",
      imageUrl: "https://dl.dropbox.com/scl/fi/l7zsmwtx9ftrhkhdzxbrf/door.jpg?rlkey=qye33xkwj5jzrgb1e3xhaoh42&dl=0"
    },
    {
      id: 4,
      title: "Duvall Study",
      year: "2021",
      imageUrl: "https://dl.dropbox.com/scl/fi/ngphgfh6qau7ckb7wbqdv/duvallll.jpg?rlkey=y984xacrldih4vtnk1jkxiqad&dl=0"
    },
    {
      id: 5,
      title: "Field Study",
      year: "2023",
      imageUrl: "https://dl.dropbox.com/scl/fi/xetcsxglcawd47h1yysg1/field.jpg?rlkey=3ttifxi9w2e11m2vmddbg7x0m&dl=0"
    },
    {
      id: 6,
      title: "Lamp Study",
      year: "2022",
      imageUrl: "https://dl.dropbox.com/scl/fi/w39tpsp4vlbogidham3ng/lamp.jpg?rlkey=ioegsmjfnrmo1bdxk9tnu6l7w&dl=0"
    },
    {
      id: 7,
      title: "Architectural Details",
      year: "2023",
      imageUrl: "https://dl.dropbox.com/scl/fi/23mudrdy0d8nu1kxmxkro/tings.jpg?rlkey=35mrm5zkzr3usm7jyy64e994v&dl=0"
    },
    {
      id: 8,
      title: "Station Design",
      year: "2022",
      imageUrl: "https://dl.dropbox.com/scl/fi/lmblrxrb3jyhm4djpc6w5/station.jpg?rlkey=1zuur3xm7j8fpuiof4r3js5pu&dl=0"
    }
  ];

  // Check if device is desktop
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsDesktop(!isMobile);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Show popup only on desktop after loading
  useEffect(() => {
    if (!loading && isDesktop) {
      setShowPopup(true);
    }
  }, [loading, isDesktop]);

  // Close popup when leaving home page
  useEffect(() => {
    if (currentPage !== "home") {
      setShowPopup(false);
    } else if (isDesktop) {
      setShowPopup(true);
    }
  }, [currentPage, isDesktop]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Position popup with fixed offset from corner on initial load
  useEffect(() => {
    if (showPopup) {
      setPosition({
        x: 50,
        y: 50
      });
    }
  }, [showPopup]);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Glitch effect for name - triggers every few seconds
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      const glitches = [
        "SM0K3YXXVII",
        "5M0K3YXXVII",
        "SMOKEYXXV11",
        "5M0K3YXXV11"
      ];
      const randomGlitch = glitches[Math.floor(Math.random() * glitches.length)];
      setGlitchText(randomGlitch);
      
      setTimeout(() => {
        setGlitchText("SMOKEYXXVII");
        setGlitchActive(false);
      }, 200);
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  }, []);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setProgress(audio.currentTime);
    };

    const setAudioTime = () => setProgress(audio.currentTime);

    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, nextTrack]);

  // Play/pause when isPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(e => console.log("Playback failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!popupRef.current || !isDesktop) return;
    
    const rect = popupRef.current.getBoundingClientRect();
    setRel({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !popupRef.current || !isDesktop) return;
    
    setPosition({
      x: e.clientX - rel.x,
      y: e.clientY - rel.y
    });
  }, [dragging, rel, isDesktop]);

  const handleMouseUp = useCallback(() => {
    if (!isDesktop) return;
    setDragging(false);
  }, [isDesktop]);

  useEffect(() => {
    if (dragging && isDesktop) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp, isDesktop]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const newTime = (clickPosition / progressBarWidth) * duration;
    
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderLoadingScreen = () => (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-black mb-4"></div>
        <p className="font-mono text-lg">LOADING SMOKEY...</p>
      </div>
    </div>
  );

  const renderPopup = () => (
    <div 
      ref={popupRef}
      className="absolute border-2 border-black bg-white shadow-lg z-40 rounded-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: dragging ? 'grabbing' : 'default',
        width: '280px'
      }}
    >
      <div 
        className="flex items-center justify-between p-2 border-b border-black bg-gray-100 rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        <div className="flex space-x-1">
          <button 
            className="w-3 h-3 bg-red-500 rounded-full"
            onClick={() => setShowPopup(false)}
          />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <div className="text-xs font-medium">MUSIC PLAYER</div>
        <div className="w-4"></div>
      </div>
      <div className="p-3 bg-white rounded-b-lg">
        <div className="text-center mb-3">
          <div className="font-bold truncate text-sm">{tracks[currentTrack].title}</div>
          <div className="text-xs text-gray-600">{tracks[currentTrack].artist}</div>
        </div>
        
        <div className="mb-3">
          <div 
            className="h-1 bg-gray-300 mb-1 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-black" 
              style={{ width: `${(progress / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button onClick={prevTrack} className="p-1 hover:bg-gray-100 rounded-full">
            <SkipBack size={16} />
          </button>
          <button 
            onClick={togglePlay}
            className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={nextTrack} className="p-1 hover:bg-gray-100 rounded-full">
            <SkipForward size={16} />
          </button>
        </div>
      </div>
      <audio ref={audioRef} src={tracks[currentTrack].url} />
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col min-h-screen bg-white text-black font-mono">
      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi+P//PwMDAwMDEwMDAwMDAwACEAE/BC2qAAAAAABJRU5ErkJggg==')] opacity-5 z-10"></div>
      
      {/* Dead tree silhouette - always black with no opacity changes */}
      <div className="fixed left-8 bottom-0 z-0">
        <Image 
          src="https://www.onlygfx.com/wp-content/uploads/2018/01/dead-tree-silhouette-2-10.png" 
          alt="Dead tree silhouette" 
          width={320}
          height={320}
          className="h-80 md:h-80 filter invert-0 opacity-100 md:opacity-100"
        />
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-8 relative z-20">
        {/* Glitching name - even smaller title */}
        <div className="mb-8 text-center">
          <h1 className={`text-3xl md:text-5xl font-bold tracking-tight mb-2 glitch-effect ${glitchActive ? 'glitch-active' : ''}`} data-text={glitchText}>
            {glitchText}
          </h1>
          <div className="h-1 w-32 bg-black mx-auto mb-6"></div>
        </div>
        
        {/* Navigation grid - slightly shorter vertically */}
        <div className="border border-black p-3 mb-16 w-full max-w-md bg-white">
          <div className="space-y-1">
            <div className="flex">
              <span className="text-black mr-2 text-sm">visitor@portfolio:~$</span>
              <span className="animate-pulse text-sm">_</span>
            </div>
            
            <nav className="grid grid-cols-2 gap-2">
              {[
                { cmd: "portfolio", label: "PORTFOLIO" },
                { cmd: "about", label: "ABOUT" },
                { cmd: "contact", label: "CONTACT" },
                { cmd: "instagram", label: "INSTAGRAM" }
              ].map((item) => (
                <button
                  key={item.cmd}
                  onClick={() => setCurrentPage(item.cmd as "home" | "portfolio" | "about" | "contact" | "instagram")}
                  className="border border-black p-2 text-center hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center bg-white min-h-[60px]"
                >
                  <div className="font-bold text-base">{item.label}</div>
                  <div className="text-sm mt-1">./{item.cmd}</div>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Social links */}
        <div className="flex space-x-6">
          <a href="#" className="p-2 border border-black hover:bg-black hover:text-white transition-colors">
            <Palette size={24} />
          </a>
          <a href="#" className="p-2 border border-black hover:bg-black hover:text-white transition-colors">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
      
      {/* Minimalist clock at bottom without border */}
      <div className="p-4 text-center">
        <div className="text-sm">{currentTime}</div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="p-8 max-w-6xl mx-auto bg-white text-black font-mono">
      <div className="mb-12">
        <button 
          onClick={() => setCurrentPage("home")}
          className="mb-8 text-lg font-medium hover:underline"
        >
          ← HOME
        </button>
        <h2 className="text-3xl font-bold mb-8">PORTFOLIO</h2>
        <div className="border-t border-black"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioItems.map((item) => (
          <div key={item.id} className="border border-black hover:border-gray-700 transition-colors bg-white">
            <div className="h-64 bg-gray-100 border-b border-black overflow-hidden">
              <Image 
                src={item.imageUrl} 
                alt={item.title}
                width={300}
                height={256}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black font-mono">
      <div className="mb-12">
        <button 
          onClick={() => setCurrentPage("home")}
          className="mb-8 text-lg font-medium hover:underline"
        >
          ← HOME
        </button>
        <h2 className="text-3xl font-bold mb-8">ABOUT</h2>
        <div className="border-t border-black"></div>
      </div>
      
      {/* Removed image and made content full width */}
      <div className="bg-white">
        <h3 className="text-2xl font-bold mb-6">SMOKEYXXVII</h3>
        <p className="mb-6 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
          nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
          nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
        </p>
        <p className="mb-6 leading-relaxed">
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
        <div className="mt-8">
          <h4 className="font-bold mb-3">EDUCATION</h4>
          <ul className="space-y-2">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black font-mono">
      <div className="mb-12">
        <button 
          onClick={() => setCurrentPage("home")}
          className="mb-8 text-lg font-medium hover:underline"
        >
          ← HOME
        </button>
        <h2 className="text-3xl font-bold mb-8">CONTACT</h2>
        <div className="border-t border-black"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white">
          <h3 className="text-2xl font-bold mb-6">GET IN TOUCH</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Email</p>
              <p>theotruss@icloud.com</p>
            </div>
            <div>
              <p className="font-medium">Location</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border border-black p-8 bg-white">
          <form className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Name</label>
              <input 
                type="text" 
                className="w-full border border-black p-3 bg-white text-black focus:outline-none focus:bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full border border-black p-3 bg-white text-black focus:outline-none focus:bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Message</label>
              <textarea 
                rows={5} 
                className="w-full border border-black p-3 bg-white text-black focus:outline-none focus:bg-gray-100"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="border border-black px-6 py-3 font-medium hover:bg-black hover:text-white transition-colors"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderInstagram = () => (
    <div className="p-8 max-w-6xl mx-auto bg-white text-black font-mono">
      <div className="mb-12">
        <button 
          onClick={() => setCurrentPage("home")}
          className="mb-8 text-lg font-medium hover:underline"
        >
          ← HOME
        </button>
        <h2 className="text-3xl font-bold mb-8">INSTAGRAM</h2>
        <div className="border-t border-black"></div>
      </div>
      
      <div className="border border-black p-6 bg-white">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">@tbjtruss</h3>
          <p className="text-gray-600">Follow for architectural inspiration and project updates</p>
        </div>
        
        {/* Instagram Embed Container */}
        <div className="min-h-[600px]">
          <iframe 
            src="https://www.instagram.com/tbjtruss/embed" 
            className="w-full h-full min-h-[600px] border-0"
            scrolling="no"
            allowTransparency={true}
          ></iframe>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.open("https://www.instagram.com/tbjtruss/", "_blank", "noopener,noreferrer")}
            className="border border-black px-6 py-3 font-medium hover:bg-black hover:text-white transition-colors"
          >
            FOLLOW ON INSTAGRAM
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return renderLoadingScreen();
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {showPopup && isDesktop && renderPopup()}
      
      <div>
        {currentPage === "home" && renderHome()}
        {currentPage === "portfolio" && renderPortfolio()}
        {currentPage === "about" && renderAbout()}
        {currentPage === "contact" && renderContact()}
        {currentPage === "instagram" && renderInstagram()}
      </div>
      
      <style jsx global>{`
        .glitch-effect {
          position: relative;
          transition: all 0.2s ease;
        }
        
        .glitch-effect::before,
        .glitch-effect::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .glitch-effect::before {
          color: #ff0000;
          z-index: -1;
        }
        
        .glitch-effect::after {
          color: #00ffff;
          z-index: -1;
        }
        
        .glitch-active {
          animation: glitch-static 0.2s linear;
        }
        
        .glitch-active::before,
        .glitch-active::after {
          opacity: 1;
          animation: glitch-layer 0.2s linear;
        }
        
        @keyframes glitch-static {
          0% { opacity: 1; }
          20% { opacity: 0.8; }
          40% { opacity: 0.9; }
          60% { opacity: 0.7; }
          80% { opacity: 0.9; }
          100% { opacity: 1; }
        }
        
        @keyframes glitch-layer {
          0% { transform: translate(0, 0); opacity: 0.8; }
          20% { transform: translate(-3px, 0); opacity: 0.6; }
          40% { transform: translate(3px, 0); opacity: 0.7; }
          60% { transform: translate(-3px, 0); opacity: 0.6; }
          80% { transform: translate(3px, 0); opacity: 0.7; }
          100% { transform: translate(0, 0); opacity: 0.8; }
        }
        
        /* Mobile tree sizing */
        @media (max-width: 768px) {
          .fixed.left-8.bottom-0 img {
            height: 40vh !important;
          }
        }
      `}</style>
    </div>
  );
}

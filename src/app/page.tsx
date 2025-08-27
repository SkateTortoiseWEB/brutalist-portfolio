"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Linkedin, Palette } from "lucide-react";

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

  const portfolioItems = [
    { id: 1, title: "Cross Section", year: "2023", imageUrl: "https://dl.dropbox.com/scl/fi/cc4l9hl0zbxqyt5rjpppx/cross.jpg?rlkey=xo5ti1buqv36uaxqxujvjd05j&dl=0" },
    { id: 2, title: "Doorway II", year: "2023", imageUrl: "https://dl.dropbox.com/scl/fi/rzgnu6rlmipxv4s8pks8f/door-2.jpg?rlkey=5gtzegks2olpgi8f8d52tmf5b&dl=0" },
    { id: 3, title: "Entryway", year: "2022", imageUrl: "https://dl.dropbox.com/scl/fi/l7zsmwtx9ftrhkhdzxbrf/door.jpg?rlkey=qye33xkwj5jzrgb1e3xhaoh42&dl=0" },
    { id: 4, title: "Duvall Study", year: "2021", imageUrl: "https://dl.dropbox.com/scl/fi/ngphgfh6qau7ckb7wbqdv/duvallll.jpg?rlkey=y984xacrldih4vtnk1jkxiqad&dl=0" },
    { id: 5, title: "Field Study", year: "2023", imageUrl: "https://dl.dropbox.com/scl/fi/xetcsxglcawd47h1yysg1/field.jpg?rlkey=3ttifxi9w2e11m2vmddbg7x0m&dl=0" },
    { id: 6, title: "Lamp Study", year: "2022", imageUrl: "https://dl.dropbox.com/scl/fi/w39tpsp4vlbogidham3ng/lamp.jpg?rlkey=ioegsmjfnrmo1bdxk9tnu6l7w&dl=0" },
    { id: 7, title: "Architectural Details", year: "2023", imageUrl: "https://dl.dropbox.com/scl/fi/23mudrdy0d8nu1kxmxkro/tings.jpg?rlkey=35mrm5zkzr3usm7jyy64e994v&dl=0" },
    { id: 8, title: "Station Design", year: "2022", imageUrl: "https://dl.dropbox.com/scl/fi/lmblrxrb3jyhm4djpc6w5/station.jpg?rlkey=1zuur3xm7j8fpuiof4r3js5pu&dl=0" }
  ];

  // Detect desktop
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsDesktop(!isMobile);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Show popup on desktop
  useEffect(() => {
    if (!loading && isDesktop) setShowPopup(true);
  }, [loading, isDesktop]);

  // Close popup when leaving home
  useEffect(() => {
    if (currentPage !== "home") setShowPopup(false);
    else if (isDesktop) setShowPopup(true);
  }, [currentPage, isDesktop]);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Initial popup position
  useEffect(() => {
    if (showPopup) setPosition({ x: 50, y: 50 });
  }, [showPopup]);

  // Time updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      const glitches = ["SM0K3YXXVII","5M0K3YXXVII","SMOKEYXXV11","5M0K3YXXV11"];
      setGlitchText(glitches[Math.floor(Math.random()*glitches.length)]);
      setTimeout(() => { setGlitchText("SMOKEYXXVII"); setGlitchActive(false); }, 200);
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => { setDuration(audio.duration); setProgress(audio.currentTime); };
    const setAudioTime = () => setProgress(audio.currentTime);
    const handleEnded = () => { setIsPlaying(false); nextTrack(); };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(e => console.log("Playback failed:", e));
    else audio.pause();
  }, [isPlaying, currentTrack]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!popupRef.current || !isDesktop) return;
    const rect = popupRef.current.getBoundingClientRect();
    setRel({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragging(true);
    e.preventDefault();
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !popupRef.current || !isDesktop) return;
    setPosition({ x: e.clientX - rel.x, y: e.clientY - rel.y });
  };
  const handleMouseUp = () => { if (isDesktop) setDragging(false); };

  useEffect(() => {
    if (dragging && isDesktop) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, rel, isDesktop]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrack((prev) => (prev+1)%tracks.length); setProgress(0); };
  const prevTrack = () => { setCurrentTrack((prev) => (prev-1+tracks.length)%tracks.length); setProgress(0); };
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current; if (!audio) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    audio.currentTime = (clickPosition / progressBar.clientWidth) * duration;
    setProgress(audio.currentTime);
  };
  const formatTime = (time:number) => `${Math.floor(time/60)}:${Math.floor(time%60).toString().padStart(2,'0')}`;

  // Loading screen
  const renderLoadingScreen = () => (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-black mb-4"></div>
        <p className="font-mono text-lg">LOADING SMOKEY...</p>
      </div>
    </div>
  );

  // Popup
  const renderPopup = () => (
    <div ref={popupRef} className="absolute border-2 border-black bg-white shadow-lg z-40 rounded-lg"
      style={{ left:`${position.x}px`, top:`${position.y}px`, cursor: dragging ? 'grabbing' : 'default', width:'280px'}}>
      <div className="flex items-center justify-between p-2 border-b border-black bg-gray-100 rounded-t-lg"
           onMouseDown={handleMouseDown}>
        <div className="flex space-x-1">
          <button className="w-3 h-3 bg-red-500 rounded-full" onClick={()=>setShowPopup(false)} />
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
          <div className="h-1 bg-gray-300 mb-1 cursor-pointer" onClick={handleProgressClick}>
            <div className="h-1 bg-black" style={{ width: `${(progress/duration)*100}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button onClick={prevTrack}><SkipBack size={16}/></button>
          <button onClick={togglePlay}>{isPlaying ? <Pause size={16}/> : <Play size={16}/>}</button>
          <button onClick={nextTrack}><SkipForward size={16}/></button>
        </div>
      </div>
      <audio ref={audioRef} src={tracks[currentTrack].url}></audio>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-mono relative overflow-x-hidden">
      {loading && renderLoadingScreen()}
      <header className="p-4 flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${glitchActive ? "text-red-500" : ""}`}>{glitchText}</h1>
        <nav className="space-x-4">
          <button onClick={()=>setCurrentPage("home")}>Home</button>
          <button onClick={()=>setCurrentPage("portfolio")}>Portfolio</button>
          <button onClick={()=>setCurrentPage("about")}>About</button>
          <button onClick={()=>setCurrentPage("contact")}>Contact</button>
          <button onClick={()=>setCurrentPage("instagram")}>Instagram</button>
        </nav>
      </header>

      {currentPage === "portfolio" && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {portfolioItems.map(item => (
            <div key={item.id} className="border-2 border-black">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-2 font-bold">{item.title} ({item.year})</div>
            </div>
          ))}
        </section>
      )}

      {showPopup && isDesktop && renderPopup()}
    </div>
  );
}

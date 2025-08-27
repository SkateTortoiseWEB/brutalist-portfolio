"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

  // Glitch effect for name
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      const glitches = ["SM0K3YXXVII", "5M0K3YXXVII", "SMOKEYXXV11", "5M0K3YXXV11"];
      const randomGlitch = glitches[Math.floor(Math.random() * glitches.length)];
      setGlitchText(randomGlitch);
      setTimeout(() => {
        setGlitchText("SMOKEYXXVII");
        setGlitchActive(false);
      }, 200);
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Play/pause handlers
  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  }, [tracks.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  }, [tracks.length]);

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
  }, [dragging, isDesktop, handleMouseMove, handleMouseUp]);

  const togglePlay = () => setIsPlaying(!isPlaying);

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

  // Navigation items typed
  const navItems: { cmd: "home" | "portfolio" | "about" | "contact" | "instagram"; label: string }[] = [
    { cmd: "portfolio", label: "PORTFOLIO" },
    { cmd: "about", label: "ABOUT" },
    { cmd: "contact", label: "CONTACT" },
    { cmd: "instagram", label: "INSTAGRAM" }
  ];

  // Remaining render functions remain unchanged (renderHome, renderPopup, renderPortfolio, etc.)
  // The only change in renderHome is:
  // Replace the previous nav map with:

  const renderHome = () => (
    <div className="flex flex-col min-h-screen bg-white text-black font-mono">
      {/* ... other elements ... */}
      <nav className="grid grid-cols-2 gap-2">
        {navItems.map((item) => (
          <button
            key={item.cmd}
            onClick={() => setCurrentPage(item.cmd)}
            className="border border-black p-2 text-center hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center bg-white min-h-[60px]"
          >
            <div className="font-bold text-base">{item.label}</div>
            <div className="text-sm mt-1">./{item.cmd}</div>
          </button>
        ))}
      </nav>
    </div>
  );

  // Return
  if (loading) return renderLoadingScreen();
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
    </div>
  );
}

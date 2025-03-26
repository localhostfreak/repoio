import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Mic, Play, Pause, Calendar, FastForward, Rewind, Volume2 } from "lucide-react";

interface AudioMessageProps {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration?: number;
  date: string;
}

const AudioMessage = ({ id, title, description, audioUrl, duration = 0, date }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Format date safely
  let formattedDate = "";
  try {
    formattedDate = date ? format(new Date(date), "MMMM d, yyyy") : "";
  } catch (error) {
    console.error("Date formatting error:", error);
  }

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(audio.duration);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        cancelAnimationFrame(animationRef.current!);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.volume = volume;
      audioRef.current = audio;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    } else {
      audioRef.current.play();
      animateVisualizer();
      animateProgress();
    }
    
    setIsPlaying(!isPlaying);
  };

  const animateVisualizer = () => {
    if (!visualizerRef.current) return;
    
    const bars = visualizerRef.current.querySelectorAll('.audio-bar');
    
    // Animate bars based on time
    bars.forEach((bar, index) => {
      const randomHeight = (Math.sin(Date.now() / 200 + index) + 1) * 8 + 4;
      (bar as HTMLElement).style.height = `${randomHeight}px`;
    });
    
    animationRef.current = requestAnimationFrame(animateVisualizer);
  };

  const animateProgress = () => {
    if (!progressRef.current || !audioRef.current) return;
    
    const percent = (currentTime / audioDuration) * 100;
    progressRef.current.style.width = `${percent}%`;
    
    if (isPlaying) {
      requestAnimationFrame(animateProgress);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    
    const newTime = percent * audioDuration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioDuration);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <motion.div 
      className="love-card bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 transform transition-all duration-300 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
          <Mic className="text-pink-400" size={20} />
        </div>
        
        <div className="flex-1">
          <h3 className="handwritten text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 mb-1">{title}</h3>
          
          <div className="flex items-center text-xs text-gray-400 mb-3">
            <Calendar size={12} className="mr-1" />
            <span>{formattedDate || "Recorded with love"}</span>
          </div>
          
          {description && (
            <p className="text-gray-300 text-sm mb-4">{description}</p>
          )}
        </div>
      </div>
      
      {/* Audio player */}
      <div className="glass-effect rounded-lg p-4">
        {/* Progress bar */}
        <div 
          className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-4 cursor-pointer"
          onClick={seek}
        >
          <div ref={progressRef} className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full" style={{ width: `${(currentTime / audioDuration) * 100}%` }}></div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={skipBackward}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-colors"
            >
              <Rewind size={16} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 text-white flex items-center justify-center hover:from-pink-500 hover:to-pink-400 transition-colors transform hover:scale-105"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            
            <button 
              onClick={skipForward}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-colors"
            >
              <FastForward size={16} />
            </button>
          </div>
          
          {/* Visualizer */}
          <div ref={visualizerRef} className="hidden md:flex audio-visualizer">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="audio-bar" style={{ height: `${Math.random() * 12 + 2}px` }}></div>
            ))}
          </div>
          
          {/* Time and volume */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-300">
              {formatTime(currentTime)} / {formatTime(audioDuration)}
            </span>
            
            <div className="hidden md:flex items-center gap-1">
              <Volume2 size={14} className="text-gray-400" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 accent-pink-500"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .audio-visualizer {
          align-items: flex-end;
          gap: 2px;
          height: 20px;
          width: 80px;
        }

        .audio-bar {
          width: 3px;
          background: linear-gradient(to top, #ec4899, #db2777);
          border-radius: 2px;
          transition: height 0.2s ease;
        }
        
        /* Custom volume slider styling */
        input[type=range] {
          height: 4px;
          background: #444;
          border-radius: 4px;
          outline: none;
        }
        
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
};

export default AudioMessage;

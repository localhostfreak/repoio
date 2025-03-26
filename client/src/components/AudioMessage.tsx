import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface AudioMessageProps {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  date: string;
}

const AudioMessage = ({ id, title, description, audioUrl, duration, date }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number[]>([]);
  const visualizerRef = useRef<HTMLDivElement>(null);

  const formattedDate = date ? format(new Date(date), "MMMM d, yyyy") : "";
  const formattedDuration = formatDuration(duration);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        stopVisualizer();
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      stopVisualizer();
    } else {
      audioRef.current.play();
      animateVisualizer();
    }
    
    setIsPlaying(!isPlaying);
  };

  const animateVisualizer = () => {
    if (!visualizerRef.current) return;
    
    const bars = visualizerRef.current.querySelectorAll('.audio-bar');
    
    // Clear any existing animations
    stopVisualizer();
    
    // Create animations for each bar
    bars.forEach((bar) => {
      const interval = window.setInterval(() => {
        const randomHeight = Math.random() * 16 + 3;
        (bar as HTMLElement).style.height = `${randomHeight}px`;
      }, 200);
      
      animationRef.current.push(interval);
    });
  };

  const stopVisualizer = () => {
    // Clear all animation intervals
    animationRef.current.forEach(interval => {
      clearInterval(interval);
    });
    animationRef.current = [];
    
    // Reset bars to original height
    if (visualizerRef.current) {
      const bars = visualizerRef.current.querySelectorAll('.audio-bar');
      bars.forEach((bar, index) => {
        const heights = [3, 8, 5, 12, 7, 14, 10, 6, 9, 4, 12, 7, 3, 9, 5];
        (bar as HTMLElement).style.height = `${heights[index % heights.length]}px`;
      });
    }
  };

  function formatDuration(seconds: number): string {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-6 mb-8 transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#FFC0CB]/20 flex items-center justify-center">
          <span className="material-icons text-[#FF1493]">mic</span>
        </div>
        
        <div>
          <h3 className="font-dancing text-xl text-[#FF1493]">{title}</h3>
          <p className="text-sm text-[#4A4A4A]">Recorded on {formattedDate}</p>
        </div>
      </div>
      
      <p className="text-[#4A4A4A] mb-6">{description}</p>
      
      <div className="flex items-center justify-between bg-[#FFF5F5] rounded-lg p-3">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#FF1493] text-white flex items-center justify-center hover:bg-[#FF6B6B] transition-colors duration-300"
        >
          <span className="material-icons">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
        
        <div ref={visualizerRef} className="audio-visualizer flex-1 mx-4">
          <div className="audio-bar h-3"></div>
          <div className="audio-bar h-8"></div>
          <div className="audio-bar h-5"></div>
          <div className="audio-bar h-12"></div>
          <div className="audio-bar h-7"></div>
          <div className="audio-bar h-14"></div>
          <div className="audio-bar h-10"></div>
          <div className="audio-bar h-6"></div>
          <div className="audio-bar h-9"></div>
          <div className="audio-bar h-4"></div>
          <div className="audio-bar h-12"></div>
          <div className="audio-bar h-7"></div>
          <div className="audio-bar h-3"></div>
          <div className="audio-bar h-9"></div>
          <div className="audio-bar h-5"></div>
        </div>
        
        <span className="text-[#4A4A4A] text-sm">{formattedDuration}</span>
      </div>

      <style jsx>{`
        .audio-visualizer {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 30px;
          padding: 0 10px;
        }

        .audio-bar {
          width: 4px;
          background-color: #FF1493;
          border-radius: 2px;
          transition: height 0.2s ease;
        }
      `}</style>
    </motion.div>
  );
};

export default AudioMessage;

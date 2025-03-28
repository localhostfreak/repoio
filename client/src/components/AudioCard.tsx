import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Play, Pause, Volume2, VolumeX, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Visualizer Component with Multiple Styles
const generateRandomBars = (count: number, minHeight: number, maxHeight: number) =>
  Array.from({ length: count }, () => Math.random() * (maxHeight - minHeight) + minHeight);

const AudioVisualizer = ({
  isPlaying,
  progress,
  isDark,
  style,
}: {
  isPlaying: boolean;
  progress: number;
  isDark: boolean;
  style: string;
}) => {
  const [bars] = useState(() => generateRandomBars(40, 10, 50));

  if (style === "none") return null;

  const renderWave = () => (
    <div className="flex items-center h-full gap-[1px]">
      {bars.map((height, i) => {
        const isActive = (i / bars.length) * 100 <= progress;
        return (
          <motion.div
            key={i}
            className={cn(
              "w-[2px] rounded-sm",
              isActive
                ? "bg-gradient-to-b from-pink-500 to-purple-500"
                : isDark
                ? "bg-gray-600"
                : "bg-gray-300"
            )}
            animate={{
              height: isPlaying ? `${height}%` : "20%",
              opacity: isPlaying ? 1 : 0.7,
            }}
            transition={{
              duration: 0.3,
              repeat: isPlaying ? Infinity : 0,
              repeatType: "reverse",
              delay: i * 0.01,
            }}
            style={{ minHeight: 4, maxHeight: "100%" }}
          />
        );
      })}
    </div>
  );

  const renderBars = () => (
    <div className="flex items-center h-full gap-[2px]">
      {bars.map((height, i) => {
        const isActive = (i / bars.length) * 100 <= progress;
        return (
          <motion.div
            key={i}
            className={cn(
              "w-1 rounded-full",
              isActive
                ? "bg-gradient-to-t from-blue-500 to-cyan-500"
                : isDark
                ? "bg-gray-600"
                : "bg-gray-300"
            )}
            animate={{
              height: isPlaying ? `${height * 1.2}%` : "15%",
              opacity: isPlaying ? 1 : 0.7,
            }}
            transition={{
              duration: 0.4,
              repeat: isPlaying ? Infinity : 0,
              repeatType: "mirror",
              delay: i * 0.02,
            }}
            style={{ minHeight: 4, maxHeight: "100%" }}
          />
        );
      })}
    </div>
  );

  const renderCircle = () => (
    <div className="flex items-center justify-center h-full w-full">
      <motion.div
        className="relative w-12 h-12"
        animate={{
          scale: isPlaying ? [1, 1.2, 1] : 1,
          rotate: isPlaying ? 360 : 0,
        }}
        transition={{
          duration: 2,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full",
              progress > (i / 12) * 100
                ? "bg-gradient-to-r from-pink-500 to-purple-500"
                : isDark
                ? "bg-gray-600"
                : "bg-gray-300"
            )}
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 30}deg) translate(20px)`,
            }}
            animate={{
              scale: isPlaying ? [1, 1.5, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              delay: i * 0.05,
            }}
          />
        ))}
      </motion.div>
    </div>
  );

  const renderHeart = () => (
    <div className="flex items-center justify-center h-full w-full">
      <motion.div
        className="relative"
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.8,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <Heart
          className={cn(
            "w-10 h-10",
            progress > 50 ? "text-pink-500 fill-pink-500" : isDark ? "text-gray-600" : "text-gray-300"
          )}
        />
      </motion.div>
    </div>
  );

  switch (style) {
    case "wave":
      return renderWave();
    case "bars":
      return renderBars();
    case "circle":
      return renderCircle();
    case "heart":
      return renderHeart();
    default:
      return renderWave();
  }
};

// AudioCard Props Interface (Updated with Schema Fields)
interface AudioCardProps {
  message: {
    _id: string;
    title: string;
    audioFile: { asset: { url: string; _ref: string } };
    caption?: string;
    description?: string;
    mood?: string;
    duration?: number;
    isPrivate: boolean;
    backgroundMusic?: { asset: { url: string; _ref: string } };
    visualizer: string;
    scheduledFor?: string;
    transcript?: string;
    reactions: Array<{ emoji: string; count: number }>;
    background?: { color: string; imageUrl: string; style: string };
    _createdAt: string;
    audioUrl?: string;
  };
  index: number;
  isDark: boolean;
  provided: any;
  inView: boolean;
}

const AudioCard: React.FC<AudioCardProps> = ({
  message,
  index,
  isDark,
  provided,
  inView,
}) => {
  const { state, controls } = useAudioPlayer(message.audioUrl);
  const [showTranscript, setShowTranscript] = useState(false);
  const [reactions, setReactions] = useState(message.reactions || []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = (state.currentTime / state.duration) * 100 || 0;

  const handleReaction = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1 } : r
        );
      }
      return [...prev, { emoji, count: 1 }];
    });
  };

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative h-full w-full group",
        "transform-gpu transition-all duration-300",
        "touch-pan-y",
        isDark ? "text-white" : "text-gray-900"
      )}
      style={{
        background: message.background?.color || "transparent",
        backgroundImage: message.background?.imageUrl
          ? `url(${message.background.imageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden h-full w-full rounded-2xl",
          "backdrop-blur-sm backdrop-filter",
          "transform-gpu transition-all duration-300",
          isDark
            ? "bg-gray-800/90 border border-gray-700/50"
            : "bg-white/90 border border-gray-200/50"
        )}
      >
        {/* Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10 p-3 flex flex-col h-full justify-between">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium truncate">{message.title}</h3>
              {message.isPrivate && (
                <span className="text-xs text-pink-500">Private</span>
              )}
            </div>
            <span className="text-xs opacity-75">
              {formatTime(state.duration || 0)}
            </span>
          </div>

          {/* Visualizer */}
          <div className="relative flex-1 min-h-[40px] max-h-[60px] mb-2">
            <div className="absolute inset-0 flex items-center">
              <AudioVisualizer
                isPlaying={state.isPlaying}
                progress={progressPercent}
                isDark={isDark}
                style={message.visualizer}
              />
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20"
              style={{ clipPath: `inset(0 ${100 - progressPercent}% 0 0)` }}
            />
          </div>

          {/* Controls and Interactive Elements */}
          <div className="flex items-center justify-between">
            {/* Play Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                state.isPlaying ? controls.pause() : controls.play()
              }
              className={cn(
                "p-2 rounded-full",
                "bg-gradient-to-r from-pink-500 to-purple-500",
                "text-white shadow-lg",
                "transform transition-all duration-300",
                "hover:shadow-pink-500/25 hover:from-pink-600 hover:to-purple-600"
              )}
            >
              {state.isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      controls.setVolume(state.volume === 0 ? 0.7 : 0)
                    }
                    className="text-pink-500"
                  >
                    {state.volume === 0 ? (
                      <VolumeX size={16} />
                    ) : (
                      <Volume2 size={16} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {state.volume === 0 ? "Unmute" : "Mute"}
                </TooltipContent>
              </Tooltip>
              <Slider
                value={[state.volume * 100]}
                max={100}
                className="w-16"
                onValueChange={(value) => controls.setVolume(value[0] / 100)}
              />
            </div>

            {/* Reactions and Transcript Toggle */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleReaction("❤️")}
                    className="text-pink-500"
                  >
                    <Heart size={16} />
                    <span className="ml-1 text-xs">
                      {reactions.find((r) => r.emoji === "❤️")?.count || 0}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Reaction</TooltipContent>
              </Tooltip>
              {message.transcript && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="text-pink-500"
                    >
                      <MessageSquare size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showTranscript ? "Hide Transcript" : "Show Transcript"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Transcript Overlay */}
          {showTranscript && message.transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 bg-black/80 text-white p-3 rounded-2xl overflow-auto"
            >
              <p className="text-xs">{message.transcript}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowTranscript(false)}
                className="absolute top-2 right-2 text-white"
              >
                Close
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

AudioCard.displayName = "AudioCard";

export default AudioCard;
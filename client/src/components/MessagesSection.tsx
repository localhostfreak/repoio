import React, { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/sanity";
import groq from "groq";
import toast from "react-hot-toast";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Switch,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/system";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AutoSizer, List } from "react-virtualized";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ExpandableCard } from "@/components/ui/expandable-card"; // Custom component, defined beloww
import { Mic, Heart, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "@/components/AudioPlayer"; // New component, defined below
import { Slider } from "@/components/ui/slider";
import { useInView } from "react-intersection-observer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

const getMessagesQuery = groq`
  *[_type == "audioMessage"] | order(_createdAt desc) {
    _id, title, audioFile { asset-> { url, _ref } }, caption, description, mood,
    duration, isPrivate, backgroundMusic { asset-> { url, _ref } }, visualizer,
    scheduledFor, transcript, reactions, background, _createdAt
  }
`;

interface AudioMessageType {
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
}

const generateRandomBars = (count: number) => 
  Array.from({ length: count }, () => Math.random() * 100);

// Update AudioVisualizer component
const AudioVisualizer = ({ isPlaying, progress, isDark }: { 
  isPlaying: boolean; 
  progress: number;
  isDark: boolean;
}) => {
  const [bars] = useState(() => generateRandomBars(30));
  
  return (
    <div className="flex items-end h-full gap-[2px]">
      {bars.map((height, i) => {
        const isActive = (i / bars.length) * 100 <= progress;
        return (
          <motion.div
            key={i}
            className={cn(
              "w-1 rounded-full",
              isActive 
                ? "bg-gradient-to-t from-pink-500 to-purple-500" 
                : isDark ? "bg-gray-700" : "bg-gray-200"
            )}
            animate={{
              height: isPlaying ? `${height}%` : "40%",
              opacity: isPlaying ? 1 : 0.5
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              repeatType: "reverse",
              delay: i * 0.02
            }}
            style={{ minHeight: 4 }}
          />
        );
      })}
    </div>
  );
};

// Update AudioCard props type
interface AudioCardProps {
  message: AudioMessageType;
  index: number;
  isDark: boolean;
  provided: any;
  inView: boolean;
}

// Update AudioCard component
const AudioCard = ({ message, index, isDark, provided, inView }: AudioCardProps) => {
  const { state, controls } = useAudioPlayer(message.audioUrl);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (state.currentTime / state.duration) * 100 || 0;

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative mb-4 group",
        "transform-gpu transition-all duration-300",
        "touch-pan-y", // Improve touch handling
        isDark ? "text-white" : "text-gray-900"
      )}
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        "backdrop-blur-sm backdrop-filter",
        "transform-gpu transition-all duration-300",
        isDark 
          ? "bg-gray-800/90 border border-gray-700/50" 
          : "bg-white/90 border border-gray-200/50",
        "group hover:shadow-xl hover:scale-[1.02]"
      )}>
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 p-4">
          {/* Title Section */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold truncate">{message.title}</h3>
            {state.isBuffering && (
              <div className="animate-pulse text-pink-500">
                <span className="text-xs">Loading...</span>
              </div>
            )}
          </div>

          {/* Modern Waveform Visualizer */}
          <div className="relative h-16 mb-4">
            <div className="absolute inset-0">
              <AudioVisualizer 
                isPlaying={state.isPlaying} 
                progress={progressPercent}
                isDark={isDark}
              />
            </div>
            {/* Progress Overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20"
              style={{ clipPath: `inset(0 ${100 - progressPercent}% 0 0)` }}
            />
          </div>

          {/* Modern Controls */}
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => state.isPlaying ? controls.pause() : controls.play()}
              className={cn(
                "p-3 rounded-full",
                "bg-gradient-to-r from-pink-500 to-purple-500",
                "text-white shadow-lg",
                "transform transition-all",
                "hover:shadow-pink-500/25 hover:from-pink-600 hover:to-purple-600"
              )}
            >
              {state.isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>

            {/* Time and Progress */}
            <div className="flex-1">
              <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ type: "spring", damping: 15 }}
                />
                <input
                  type="range"
                  min={0}
                  max={state.duration}
                  value={state.currentTime}
                  onChange={(e) => controls.seek(parseFloat(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between mt-1 text-xs opacity-75">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => controls.setVolume(state.volume === 0 ? 0.7 : 0)}
                className="text-pink-500"
              >
                {state.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider
                value={[state.volume * 100]}
                max={100}
                className="w-20"
                onValueChange={(value) => controls.setVolume(value[0] / 100)}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

AudioCard.displayName = 'AudioCard';

const MessagesSection = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [layout, setLayout] = useState<"bento" | "hover" | "expandable">("bento");
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [messagesOrder, setMessagesOrder] = useState<AudioMessageType[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { data: messages = [], isLoading, error } = useQuery<AudioMessageType[]>({
    queryKey: ["audioMessages", moodFilter],
    queryFn: async () => {
      try {
        return await client.fetch(
          moodFilter
            ? `${getMessagesQuery} [mood == "${moodFilter}"]`
            : getMessagesQuery
        );
      } catch (err) {
        toast.error("Failed to fetch story chapters!");
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => await client.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audioMessages"] });
      toast.success("Chapter removed!", { icon: "💔" });
    },
    onError: () => toast.error("Deletion failed!"),
  });

  const filteredMessages = useMemo(
    () =>
      messagesOrder.length
        ? messagesOrder.map((msg) => ({
            ...msg,
            audioUrl: msg.audioFile?.asset?.url || undefined,
          }))
        : messages.map((msg) => ({
            ...msg,
            audioUrl: msg.audioFile?.asset?.url || undefined,
          })),
    [messages, messagesOrder]
  );

  useEffect(() => {
    setMessagesOrder(messages);
  }, [messages]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(filteredMessages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMessagesOrder(items);
  };

  // Simplified renderMessageCard function
  const renderMessageCard = (message: AudioMessageType, index: number) => {
    return (
      <Draggable key={message._id} draggableId={message._id} index={index}>
        {(provided) => (
          <AudioCard
            message={message}
            index={index}
            isDark={isDark}
            provided={provided}
            inView={inView}
          />
        )}
      </Draggable>
    );
  };

  return (
    <ScrollArea 
      className={cn(
        "h-[calc(100vh-4rem)] overflow-y-auto overscroll-none",
        "scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent",
        isDark && "dark scrollbar-thumb-pink-400/20"
      )}
      role="region"
      aria-label="Audio messages section"
    >
      <div 
        ref={(el) => {
          containerRef.current = el;
          ref(el); // Attach intersection observer ref
        }}
        className={cn(
          "container mx-auto px-4 py-8 transition-colors duration-300",
          "min-h-screen",
          isDark 
            ? "bg-gray-900 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black" 
            : "bg-white text-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100"
        )}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <Typography 
              variant="h4" 
              className={cn(
                "transition-colors duration-300",
                isDark ? "text-pink-400" : "text-pink-600"
              )}
            >
              Audio Story Chapters
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: { xs: 2, sm: 0 } }}>
              <FormControl size="small">
                <InputLabel>Layout</InputLabel>
                <Select
                  value={layout}
                  label="Layout"
                  onChange={(e) => setLayout(e.target.value as "bento" | "hover" | "expandable")}
                >
                  <MenuItem value="bento">Bento Grid</MenuItem>
                  <MenuItem value="hover">Hover Effect</MenuItem>
                  <MenuItem value="expandable">Expandable Cards</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Mood</InputLabel>
                <Select
                  value={moodFilter || ""}
                  label="Mood"
                  onChange={(e) => setMoodFilter(e.target.value || null)}
                >
                  <MenuItem value="">All Moods</MenuItem>
                  <MenuItem value="romantic">Romantic</MenuItem>
                  <MenuItem value="happy">Happy</MenuItem>
                  <MenuItem value="reflective">Reflective</MenuItem>
                  <MenuItem value="playful">Playful</MenuItem>
                  <MenuItem value="missingYou">Missing You</MenuItem>
                </Select>
              </FormControl>
              <Switch 
                checked={isDark} 
                onChange={() => setIsDark(!isDark)}
                className={cn(
                  "transition-colors duration-300",
                  isDark ? "bg-pink-400" : "bg-pink-600"
                )}
              />
            </Box>
          </motion.div>
        </motion.div>

        {/* Messages Grid */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="messages">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cn(
                  "grid gap-4 transition-all duration-300",
                  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                  "auto-rows-max"
                )}
              >
                {filteredMessages.map((message, index) => 
                  renderMessageCard(message, index)
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add Message Button */}
        <motion.div
          className="fixed bottom-6 right-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className={cn(
              "rounded-full transition-all duration-300",
              isDark 
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                : "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
            )}
          >
            <Mic className="mr-2" />
            Record New Story
          </Button>
        </motion.div>
      </div>
    </ScrollArea>
  );
};

export default MessagesSection;
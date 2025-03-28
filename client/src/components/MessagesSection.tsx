import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Switch,
  useMediaQuery,
} from "@mui/material";
import { motion, HTMLMotionProps } from "framer-motion";
import { useTheme } from "@mui/system";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
} from "react-beautiful-dnd";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import AudioCard from "./AudioCard";

// GROQ query (unchanged)
const getMessagesQuery = groq`*[_type == "audioMessage"] | order(_createdAt desc) {
  _id, title, audioFile { asset-> { url, _ref } }, caption, description, mood,
  duration, isPrivate, backgroundMusic { asset-> { url, _ref } }, visualizer,
  scheduledFor, transcript, reactions, background, _createdAt
}`;

// AudioMessageType interface (unchanged)
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

// Grid areas and card sizes (unchanged from last iteration)
const gridAreasDesktop = `
  "card1 card1 card2 card3"
  "card4 card5 card2 card6"
  "card7 card8 card9 card6"
  "card10 card11 card12 card13"
`;

const gridAreasMobile = `
  "card1"
  "card2"
  "card3"
  "card4"
  "card5"
  "card6"
  "card7"
  "card8"
  "card9"
  "card10"
  "card11"
  "card12"
  "card13"
`;

const cardSizes = [
  "col-span-2 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-2 min-h-[260px] max-h-[300px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-2 min-h-[260px] max-h-[300px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-2 min-h-[260px] max-h-[300px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
  "col-span-1 row-span-1 min-h-[120px] max-h-[150px]",
];

// Custom type to merge motion and draggable props
type MotionDraggableProps = HTMLMotionProps<"div"> & {
  "data-rbd-draggable-id"?: string;
  "data-rbd-draggable-context-id"?: string;
  "data-rbd-drag-handle-draggable-id"?: string;
  "data-rbd-drag-handle-context-id"?: string;
  onDragStart?: any; // Relax typing to avoid conflict
};

const MessagesSection = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [messagesOrder, setMessagesOrder] = useState<AudioMessageType[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [inViewRef, inView] = useInView({ threshold: 0.1, triggerOnce: true });

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

  const renderMessageCard = (message: AudioMessageType, index: number) => (
    <Draggable key={message._id} draggableId={message._id} index={index}>
      {(provided: DraggableProvided) => (
        <motion.div
          className={cn(
            "rounded-2xl shadow-md transition-all duration-300 overflow-hidden",
            cardSizes[index % cardSizes.length],
            "hover:scale-105 hover:shadow-xl",
            isDark ? "bg-gray-800/95" : "bg-white/95"
          )}
          style={{ gridArea: `card${(index % 13) + 1}` }}
          whileHover={{ zIndex: 10 }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          // Explicitly type as MotionDraggableProps to resolve conflict
          // @ts-ignore
          as={motion.div as any}
        >
          <AudioCard
            message={message}
            index={index}
            isDark={isDark}
            inView={inView}
            provided={provided} // Pass provided back to AudioCard
          />
        </motion.div>
      )}
    </Draggable>
  );

  return (
    <ScrollArea
      className={cn(
        "h-[calc(100vh-4rem)] overflow-y-auto overscroll-none",
        "scrollbar-thin scrollbar-thumb-pink-500/30 scrollbar-track-transparent",
        isDark && "dark scrollbar-thumb-pink-400/30"
      )}
      role="region"
      aria-label="Audio messages section"
    >
      <div
        ref={inViewRef} // Use the callback ref from useInView
        className={cn(
          "container mx-auto px-4 py-8 transition-colors duration-300",
          "min-h-screen",
          isDark
            ? "bg-gradient-to-b from-gray-900 to-black text-white"
            : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
        )}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <Typography
              variant="h4"
              className={cn(
                "font-bold transition-colors duration-300",
                isDark ? "text-pink-400" : "text-pink-600"
              )}
            >
              Audio Story Chapters
              {moodFilter && (
                <span className="text-sm ml-2 opacity-75">
                  ({moodFilter.charAt(0).toUpperCase() + moodFilter.slice(1)})
                </span>
              )}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: { xs: 2, sm: 0 } }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Mood</InputLabel>
                <Select
                  value={moodFilter || ""}
                  label="Mood"
                  onChange={(e) => setMoodFilter(e.target.value || null)}
                  className={cn(isDark ? "text-white" : "text-gray-900")}
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
          </div>
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
                  isMobile ? "grid-cols-1" : "grid-cols-4",
                  "auto-rows-min"
                )}
                style={{
                  gridTemplateAreas: isMobile ? gridAreasMobile : gridAreasDesktop,
                }}
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
              "rounded-full shadow-lg transition-all duration-300",
              isDark
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                : "bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white"
            )}
          >
            <Mic className="mr-2" /> Record New Story
          </Button>
        </motion.div>
      </div>
    </ScrollArea>
  );
};

export default MessagesSection;
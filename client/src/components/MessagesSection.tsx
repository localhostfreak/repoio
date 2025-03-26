import { useQuery } from "@tanstack/react-query";
import AudioMessage from "./AudioMessage";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

interface AudioMessageType {
  _id: string;
  title: string;
  audioUrl: string;
  description?: string;
  duration?: number;
  _createdAt: string;
}

const MessagesSection = () => {
  const { data: messages = [], isLoading } = useQuery<AudioMessageType[]>({
    queryKey: ["/api/audio-messages"],
  });

  return (
    <section id="messages" className="py-20 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#FFC0CB] opacity-10 animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#FF6B6B] opacity-10 animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-4xl font-playfair text-[#FF6B6B] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Audio Love Notes
        </motion.h2>
        
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            Array(2).fill(0).map((_, idx) => (
              <div key={idx} className="relative h-64 bg-gray-100 animate-pulse rounded-lg mb-8"></div>
            ))
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <AudioMessage 
                key={message._id}
                id={message._id}
                title={message.title}
                description={message.description || "A special audio message just for you."}
                audioUrl={message.audioUrl}
                duration={message.duration || 0}
                date={message._createdAt}
              />
            ))
          ) : (
            <div className="text-center py-16 px-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm border border-pink-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
                <Mic className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-dancing text-[#FF1493] mb-2">No audio messages yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Record your first voice message to share sweet words, thoughts, or just to say hello when you're apart.</p>
              <button
                onClick={() => {
                  const button = document.querySelector('.createContentButton');
                  if (button instanceof HTMLElement) {
                    button.click();
                  }
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF1493] text-white font-medium py-2 px-6 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Mic className="w-4 h-4" />
                Record Your First Message
              </button>
            </div>
          )}
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button
              onClick={() => {
                const button = document.querySelector('.createContentButton');
                if (button instanceof HTMLElement) {
                  button.click();
                }
              }}
              className="inline-block bg-[#FF1493] hover:bg-[#FF6B6B] text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Record a New Message
            </button>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        `
      }}></style>
    </section>
  );
};

export default MessagesSection;

import { useQuery } from "@tanstack/react-query";
import AudioMessage from "./AudioMessage";
import { motion } from "framer-motion";
import { Link } from "wouter";

const MessagesSection = () => {
  const { data: messages = [], isLoading } = useQuery({
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
            messages.map((message: any) => (
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
            <>
              {/* Default audio messages when no data is available */}
              <AudioMessage 
                id="1"
                title="Good Morning Sunshine"
                description="Starting your day with a little reminder of how much you mean to me. Listen to this whenever you miss the sound of my voice."
                audioUrl=""
                duration={102} // 1:42
                date={new Date().toISOString()}
              />
              
              <AudioMessage 
                id="2"
                title="Missing You Tonight"
                description="The stars are out, and I'm thinking of you. Just wanted to share how my day went and hear about yours soon."
                audioUrl=""
                duration={138} // 2:18
                date={new Date().toISOString()}
              />
            </>
          )}
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/record">
              <a className="inline-block bg-[#FF1493] hover:bg-[#FF6B6B] text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Record a New Message
              </a>
            </Link>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default MessagesSection;

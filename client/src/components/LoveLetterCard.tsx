import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface LoveLetterCardProps {
  title: string;
  date: string;
  content: string;
  coverTitle: string;
}

const LoveLetterCard = ({ title, date, content, coverTitle }: LoveLetterCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLetter = () => {
    setIsOpen(true);
    createHeartBurst();
  };

  const createHeartBurst = () => {
    const hearts = 12;
    const container = document.getElementById("heart-container");
    if (!container) return;

    const letterRect = document.getElementById(`letter-${title}`)?.getBoundingClientRect();
    if (!letterRect) return;

    const centerX = letterRect.left + letterRect.width / 2;
    const centerY = letterRect.top + letterRect.height / 2;

    for (let i = 0; i < hearts; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart-particle");
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        // Random size
        const size = Math.random() * 20 + 15;
        
        heart.innerHTML = '<span class="heart-icon"></span>';
        heart.style.left = `${centerX}px`;
        heart.style.top = `${centerY}px`;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.position = "absolute";
        heart.style.transition = "all 1s ease-out";
        heart.style.zIndex = "9999";
        
        container.appendChild(heart);
        
        // Trigger animation on next frame
        requestAnimationFrame(() => {
          heart.style.transform = `translate(${endX - centerX}px, ${endY - centerY}px) scale(0.5)`;
          heart.style.opacity = "0";
        });
        
        setTimeout(() => {
          heart.remove();
        }, 1000);
      }, i * 150);
    }
  };

  const formattedDate = date ? format(new Date(date), "MMM d, yyyy") : "";

  return (
    <div id={`letter-${title}`} className="relative">
      <motion.div 
        className="paper-texture bg-white p-8 rounded-lg transform-gpu"
        initial={{ rotateY: 90, originX: 0 }}
        animate={{ rotateY: isOpen ? 0 : 90, originX: 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ 
          perspective: 1200, 
          transformStyle: "preserve-3d", 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          backgroundImage: "url('https://images.unsplash.com/photo-1601662528567-526cd06f6582?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')",
          backgroundBlendMode: "overlay"
        }}
      >
        <div className="absolute top-3 right-3">
          <span className="text-[#FFC0CB] text-sm">{formattedDate}</span>
        </div>
        
        <h3 className="font-dancing text-3xl text-[#FF1493] mb-6">{title}</h3>
        
        <div className="prose prose-lg">
          <p className="font-lora mb-4">{content}</p>
          
          <p className="font-dancing text-xl text-right mt-8 text-[#FF6B6B]">
            Forever Yours
          </p>
        </div>
      </motion.div>
      
      {!isOpen && (
        <div 
          className="letter-cover absolute inset-0 paper-texture bg-[#FFC0CB]/20 rounded-lg p-6 flex items-center justify-center transform-gpu cursor-pointer shadow-lg"
          onClick={openLetter}
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1601662528567-526cd06f6582?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')",
            backgroundBlendMode: "overlay"
          }}
        >
          <div className="text-center">
            <span className="material-icons text-[#FF6B6B] text-4xl mb-4">favorite</span>
            <h3 className="font-dancing text-2xl text-[#FF1493]">{coverTitle}</h3>
            <p className="text-sm mt-2 text-[#4A4A4A]">Click to open</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoveLetterCard;

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  title: string;
  message: string;
}

const HeroSection = ({ title, message }: HeroSectionProps) => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] md:h-screen overflow-hidden">
      {/* Parallax background */}
      <div 
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-50 to-white"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-15"></div>
        
        {/* Floating hearts background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className={`absolute w-${Math.floor(Math.random() * 8) + 4} h-${Math.floor(Math.random() * 8) + 4} text-pink-300 opacity-${Math.floor(Math.random() * 8) + 2}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.floor(Math.random() * 10) + 8}s ease-in-out ${Math.random() * 5}s infinite`
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center py-16 md:py-0">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-[#FF1493] mb-6 drop-shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {title || "Every Moment With You"}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl font-lora text-[#4A4A4A] max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {message || "A digital space where our love story unfolds, capturing our most cherished moments and heartfelt expressions."}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => scrollToSection("love-letters")} 
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FF1493] text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Begin Our Journey
            </button>
            <button 
              onClick={() => {
                const button = document.querySelector('.createContentButton');
                if (button instanceof HTMLElement) {
                  button.click();
                }
              }}
              className="bg-white text-[#FF1493] border-2 border-[#FF1493] font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-pink-50"
            >
              Create a Memory
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#FF1493]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 2, duration: 1 },
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }}
      >
        <ChevronDown size={30} strokeWidth={2} />
      </motion.div>
    </section>
  );
};

export default HeroSection;

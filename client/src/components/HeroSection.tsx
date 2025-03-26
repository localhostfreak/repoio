import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    <section id="home" className="relative h-screen overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="" 
          aria-hidden="true" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-playfair text-[#FF1493] mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {title || "Every Moment With You"}
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl font-lora text-[#4A4A4A] max-w-xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          {message || "A digital space where our love story unfolds, capturing our most cherished moments and heartfelt expressions."}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <button 
            onClick={() => scrollToSection("love-letters")} 
            className="inline-block bg-[#FF6B6B] hover:bg-[#FF1493] text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Begin Our Journey
          </button>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#4A4A4A] animate-bounce">
        <span className="material-icons">keyboard_arrow_down</span>
      </div>
    </section>
  );
};

export default HeroSection;

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { client, getLandingPageQuery } from "@/lib/sanity";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import LoveLettersSection from "@/components/LoveLettersSection";
import MemoriesSection from "@/components/MemoriesSection";
import WobbleFeatureSection from "@/components/WobbleFeatureSection";
import TimelineSection from "@/components/TimelineSection";
import LoveNoteModal from "@/components/LoveNoteModal";
import Footer from "@/components/Footer";
import MessagesSection from "@/components/MessagesSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParallaxSection } from "@/components/ParallaxProvider";

interface LandingPage {
  title: string;
  message: string;
  backgroundEffect?: "hearts" | "petals" | "stars" | "none";
}

const Home = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { data: landingData } = useQuery({
    queryKey: ["landing"],
    queryFn: () => client.fetch(getLandingPageQuery),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    initialData: {
      title: "Every Moment With You",
      message: "A digital space where our love story unfolds...",
      backgroundEffect: "hearts",
    } as LandingPage,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Scroll progress for main parallax effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative w-full overflow-x-hidden">
      {/* Fixed Background with Parallax */}
      <motion.div 
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          y: backgroundY,
          opacity,
          backgroundImage: 'url("/images/hearts-bg.png")',
          backgroundSize: 'cover'
        }}
      />

      <div className="w-full">
        <div className={`min-h-screen relative ${
          isDarkMode
            ? "bg-gradient-to-br from-[#2A1B3D]/90 to-[#1A0F2A]/90"
            : "bg-gradient-to-br from-[#FFF5F5]/90 to-[#FFE6E6]/90"
        } backdrop-blur-sm font-lora antialiased`}>
          
          <NavigationBar
            extraControls={
              <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                <button
                  onClick={toggleDarkMode}
                  className="px-4 py-2 rounded-full bg-opacity-30 bg-[#FF6B6B] hover:bg-opacity-50 
                           transition-all transform hover:scale-105"
                >
                  {isDarkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
                <button
                  onClick={openModal}
                  className="px-4 py-2 rounded-full bg-opacity-30 bg-[#FFB6C1] hover:bg-opacity-50 
                           transition-all transform hover:scale-105"
                >
                  ✍️ Love Note
                </button>
              </div>
            }
            isDarkMode={isDarkMode}
          />

          {/* Layered Content Sections with Perspective */}
          <div className="relative perspective-1000">
            {/* Hero Layer */}
            <ParallaxSection 
              offset={50} 
              direction="up" 
              scale={1.05} 
              className="z-10 w-full max-w-[100vw] overflow-hidden px-4 md:px-8 lg:px-12"
            >
              <HeroSection
                title={landingData?.title}
                message={landingData?.message}
                isDarkMode={isDarkMode}
              />
            </ParallaxSection>

            {/* Content Layers */}
            <div className="space-y-16 md:space-y-32 mt-12 md:mt-20">
              <ParallaxSection 
                offset={30} 
                direction="left" 
                className="z-20 w-full max-w-[100vw] overflow-hidden px-4 md:px-8 lg:px-12"
              >
                <LoveLettersSection isDarkMode={isDarkMode} />
              </ParallaxSection>

              <ParallaxSection offset={75} direction="right" className="z-30">
                <MemoriesSection isDarkMode={isDarkMode} />
              </ParallaxSection>

              <ParallaxSection offset={60} direction="up" scale={1.05} className="z-40">
                <WobbleFeatureSection isDarkMode={isDarkMode} />
              </ParallaxSection>

              <ParallaxSection offset={40} direction="left" className="z-50">
                <MessagesSection isDarkMode={isDarkMode} />
              </ParallaxSection>

              <ParallaxSection offset={30} direction="right" className="z-60">
                <TimelineSection isDarkMode={isDarkMode} />
              </ParallaxSection>
            </div>

            <Footer isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      <LoveNoteModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Enhanced Global Styles */}
      <style>{`
        .hearts-bg {
          background: url("/images/hearts-bg.png") repeat;
          opacity: 0.1;
          animation: parallax 30s infinite linear;
        }
        @keyframes parallax {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }
        .heart-pulse {
          width: 30px;
          height: 30px;
          background: radial-gradient(circle, #FF6B6B 40%, transparent 70%);
          border-radius: 50%;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .animate-fade-up {
          animation: fadeUp 1.2s ease-out forwards;
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Typography */
        @media (max-width: 640px) {
          h1 { font-size: clamp(2rem, 5vw, 3rem); }
          h2 { font-size: clamp(1.5rem, 4vw, 2rem); }
          p { font-size: clamp(1rem, 3vw, 1.125rem); }
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 2rem;
        }

        /* Glass Effect */
        .glass-effect {
          backdrop-filter: blur(8px);
          background: ${isDarkMode ? 
            'rgba(42, 27, 61, 0.7)' : 
            'rgba(255, 245, 245, 0.7)'};
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .mobile-tilt {
            transform: none !important;
          }
        }

        /* Dark Mode Transitions */
        * {
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Perspective and 3D transforms */
        .perspective-1000 {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        /* Responsive container adjustments */
        @media (max-width: 640px) {
          .space-y-32 { --tw-space-y-reverse: 0; margin-top: calc(4rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(4rem * var(--tw-space-y-reverse)); }
          .mt-20 { margin-top: 2rem; }
        }

        /* Layered section improvements */
        .section-layer {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Enhanced mobile optimizations */
        @media (max-width: 768px) {
          .perspective-1000 {
            perspective: none;
          }
          .mobile-optimize {
            transform: none !important;
            transition: opacity 0.3s ease;
          }
        }
      `}</style>
    </main>
  );
};

export default Home;
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import LoveLettersSection from "@/components/LoveLettersSection";
import MemoriesSection from "@/components/MemoriesSection";
import MessagesSection from "@/components/MessagesSection";
import Footer from "@/components/Footer";

interface LandingPage {
  title: string;
  message: string;
  backgroundEffect?: "hearts" | "petals" | "stars" | "none";
}

interface HeroSectionProps {
  title: string;
  message: string;
  className?: string;
  children?: React.ReactNode;
}
const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationIntensity, setAnimationIntensity] = useState<"low" | "high">("high");

  const { data: landingData } = useQuery({
    queryKey: ["/api/landing"],
    queryFn: async () => {
      const response = await fetch("/api/landing");
      if (!response.ok) throw new Error("Failed to fetch landing data");
      return (await response.json()) as LandingPage;
    },
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

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleAnimationIntensity = () =>
    setAnimationIntensity((prev) => (prev === "high" ? "low" : "high"));

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-[#2A1B3D] text-[#E6D9F2]" : "bg-[#FFF5F5] text-[#4A4A4A]"
      } font-lora antialiased relative overflow-hidden`}
    >
      {/* Dynamic Background Effect */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          landingData?.backgroundEffect === "hearts" ? "hearts-bg" : 
          landingData?.backgroundEffect === "petals" ? "petals-bg" : 
          landingData?.backgroundEffect === "stars" ? "stars-bg" : ""
        }`}
      />

      {/* Navigation with Toggles */}
      <NavigationBar
        extraControls={
          <div className="flex gap-4">
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 rounded-full bg-opacity-20 bg-[#FF6B6B] hover:bg-opacity-40 transition-all"
            >
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={toggleAnimationIntensity}
              className="px-3 py-1 rounded-full bg-opacity-20 bg-[#FFB6C1] hover:bg-opacity-40 transition-all"
            >
              {animationIntensity === "high" ? "🎨 Subtle" : "✨ Vivid"}
            </button>
          </div>
        }
      />

      {/* Hero Section with Schema-Driven Content */}
      <HeroSection
        title={landingData?.title ?? "Every Moment With You"}
        message={landingData?.message ?? "A digital space where our love story unfolds..."}
        className={`animate-fade-up ${animationIntensity === "high" ? "delay-200" : ""}`}
      >
        <div className="mt-6 flex gap-4">
          <button className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg shadow-md hover:bg-[#FF8787] transition-all animate-fade-in">
            Write a Love Note
          </button>
          <div className="heart-pulse animate-float" />
        </div>
      </HeroSection>

      {/* Love Letters Section with Unfolding Animation */}
      
      <div className="paper-texture p-6 rounded-lg mx-4 my-8 animate-unfold"
  
      >
      <LoveLettersSection
      />
      </div>
      
      {/* Memories Section with Spotlight Carousel */}
      <div  className="relative"
    >

      <MemoriesSection
       
       
       />
       </div>

      {/* Messages Section with Love Pulse */}
      <div  className="py-12"></div>
      <MessagesSection/>

      <Footer />

      {/* Enhanced Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Background Effects */
          .hearts-bg {
            background: url('data:image/svg+xml,...') repeat;
            opacity: 0.1;
            animation: float 10s infinite ${animationIntensity === "high" ? "" : "paused"};
          }
          .petals-bg {
            background: url('data:image/svg+xml,...') repeat;
            opacity: 0.15;
            animation: float 12s infinite ${animationIntensity === "high" ? "" : "paused"};
          }
          .stars-bg {
            background: radial-gradient(circle, #FFF 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.2;
            animation: twinkle 8s infinite ${animationIntensity === "high" ? "" : "paused"};
          }

          /* Heart Pulse */
          .heart-pulse {
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, #FF6B6B 40%, transparent 70%);
            border-radius: 50%;
            animation: pulse 1.5s infinite ease-in-out;
          }

          /* Animations */
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.5; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes unfold {
            0% { transform: perspective(1200px) rotateY(90deg); }
            100% { transform: perspective(1200px) rotateY(0deg); }
          }
          @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes fadeUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }

          .animate-fade-up { animation: fadeUp 1.2s ease-out forwards; }
          .animate-unfold { animation: unfold 2s ease-out forwards; }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .paper-texture { background: url('https://images.unsplash.com/photo-1601662528567-526cd06f6582') overlay; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

          /* Responsive Tweaks */
          @media (max-width: 768px) {
            .heart-pulse { width: 20px; height: 20px; }
          }
        `,
      }} />
    </div>
  );
};

// Memory Spotlight Component (Innovative Feature)
const MemorySpotlight = () => {
  const { data: memories } = useQuery({
    queryKey: ["/api/galleryItems"],
    queryFn: async () => {
      const res = await fetch("/api/galleryItems?limit=3");
      return await res.json();
    },
  });

  return (
    <div className="carousel flex gap-4 overflow-x-auto p-4">
      {memories?.map((item: any) => (
        <div key={item._id} className="min-w-[200px] paper-texture p-4 rounded-lg animate-fade-in">
          <img src={item.media?.url} alt={item.title} className="w-full h-32 object-cover rounded" />
          <p className="font-dancing text-lg mt-2">{item.title}</p>
          <span className="text-sm">{new Date(item.date).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
};

export default Home;
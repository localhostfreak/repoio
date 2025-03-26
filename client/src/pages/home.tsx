import { useQuery } from "@tanstack/react-query";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import LoveLettersSection from "@/components/LoveLettersSection";
import MemoriesSection from "@/components/MemoriesSection";
import MessagesSection from "@/components/MessagesSection";
import Footer from "@/components/Footer";

const Home = () => {
  const { data: landingData } = useQuery({
    queryKey: ["/api/landing"],
  });

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#4A4A4A] font-lora antialiased">
      <NavigationBar />
      <HeroSection 
        title={landingData?.title || "Every Moment With You"} 
        message={landingData?.message || "A digital space where our love story unfolds, capturing our most cherished moments and heartfelt expressions."} 
      />
      <LoveLettersSection />
      <MemoriesSection />
      <MessagesSection />
      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes unfold {
          0% { transform: perspective(1200px) rotateY(90deg); transform-origin: left; }
          100% { transform: perspective(1200px) rotateY(0deg); transform-origin: left; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 6s ease-in-out 2s infinite;
        }
        
        .animate-unfold {
          animation: unfold 2s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
        
        .animate-fade-up {
          animation: fadeUp 1.2s ease-out forwards;
        }
        
        .paper-texture {
          background-image: url('https://images.unsplash.com/photo-1601662528567-526cd06f6582?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80');
          background-blend-mode: overlay;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .heart-icon {
          display: inline-block;
          width: 24px;
          height: 24px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FF6B6B' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
          background-size: contain;
        }
        
        /* Font classes */
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        
        .font-lora {
          font-family: 'Lora', serif;
        }
        
        .font-dancing {
          font-family: 'Dancing Script', cursive;
        }
        
        @media (prefers-reduced-motion) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

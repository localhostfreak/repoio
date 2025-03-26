import { useState } from "react";
import { Link } from "wouter";

const NavigationBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-[#FFF5F5]/75 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-dancing text-[#FF6B6B] font-bold">
          Our Love Story
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('love-letters')}
            className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
          >
            Love Letters
          </button>
          <button 
            onClick={() => scrollToSection('memories')}
            className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
          >
            Memories
          </button>
          <button 
            onClick={() => scrollToSection('messages')}
            className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
          >
            Messages
          </button>
        </div>
        
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-[#4A4A4A]"
        >
          <span className="material-icons">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('love-letters')}
              className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
            >
              Love Letters
            </button>
            <button 
              onClick={() => scrollToSection('memories')}
              className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
            >
              Memories
            </button>
            <button 
              onClick={() => scrollToSection('messages')}
              className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300"
            >
              Messages
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;

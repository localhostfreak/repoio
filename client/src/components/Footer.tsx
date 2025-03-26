import { Link } from "wouter";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-white py-10 border-t border-[#FFC0CB]/20">
      <div className="container mx-auto px-4 text-center">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <a className="font-dancing text-2xl text-[#FF6B6B]">Our Love Story</a>
          </Link>
        </motion.div>
        
        <motion.p 
          className="text-[#4A4A4A] text-sm max-w-md mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A digital space for our moments, memories, and messages. Distance may separate us, but love connects us always.
        </motion.p>
        
        <motion.div 
          className="flex justify-center space-x-6 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="#love-letters">
            <a className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300">
              <span className="material-icons">favorite</span>
            </a>
          </Link>
          <Link href="#messages">
            <a className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300">
              <span className="material-icons">mail</span>
            </a>
          </Link>
          <Link href="#memories">
            <a className="text-[#4A4A4A] hover:text-[#FF1493] transition-colors duration-300">
              <span className="material-icons">photo_camera</span>
            </a>
          </Link>
        </motion.div>
        
        <motion.p 
          className="text-xs text-[#4A4A4A]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Made with love, for the love of my life © {new Date().getFullYear()}
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;

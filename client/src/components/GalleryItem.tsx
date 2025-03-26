import { motion } from "framer-motion";

interface GalleryItemProps {
  id: string;
  title: string;
  imageUrl: string;
  reactionCount: number;
}

const GalleryItem = ({ id, title, imageUrl, reactionCount }: GalleryItemProps) => {
  return (
    <motion.div 
      className="relative group overflow-hidden rounded-lg"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
      />
        
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-sm font-medium">{title}</p>
        <div className="flex items-center mt-1">
          <span className="material-icons text-xs text-[#FFC0CB]">favorite</span>
          <span className="text-xs ml-1">{reactionCount}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryItem;

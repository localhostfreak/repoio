import { motion } from "framer-motion";

interface AlbumCardProps {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  itemsCount: number;
  date?: string;
}

const AlbumCard = ({ id, title, description, coverImage, itemsCount, date }: AlbumCardProps) => {
  return (
    <motion.div 
      className="group relative bg-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={coverImage || "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
          <h3 className="text-xl font-playfair">{title}</h3>
          <p className="text-sm opacity-90">{itemsCount} {itemsCount === 1 ? 'memory' : 'memories'}</p>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-[#4A4A4A] line-clamp-3">{description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-[#4A4A4A]">{date}</span>
          
          <a 
            href={`/album/${id}`} 
            className="text-[#FF1493] hover:text-[#FF6B6B] transition-colors duration-300"
          >
            <span className="material-icons text-base">visibility</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default AlbumCard;

import { useQuery } from "@tanstack/react-query";
import AlbumCard, { AlbumCardProps } from "./AlbumCard";
import GalleryItem from "./GalleryItem";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Camera, FolderHeart } from "lucide-react";

interface Album {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  itemsCount?: number;
  _createdAt?: string;
}

interface GalleryItemType {
  _id: string;
  title: string;
  thumbnailUrl?: string;
  mediaUrl: string;
  reactions?: Array<{ emoji: string; count: number }>;
}

interface MemoriesSectionProps {
  isDarkMode: boolean;
}

const MemoriesSection = ({ isDarkMode }: MemoriesSectionProps) => {
  // Type-safe queries with loading and error states
  const { 
    data: albumsData, 
    isLoading: albumsLoading, 
    isError: albumsError 
  } = useQuery<Album[]>({
    queryKey: ['/api/albums'],
    staleTime: 5 * 60 * 1000
  });

  const { 
    data: featuredItemsData, 
    isLoading: itemsLoading, 
    isError: itemsError 
  } = useQuery<GalleryItemType[]>({
    queryKey: ['/api/gallery/featured'],
    staleTime: 5 * 60 * 1000
  });

  // Safe access to data
  const albums = albumsData || [];
  const featuredItems = featuredItemsData || [];

  return (
    <section id="memories-section" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-pink-900/5 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex items-center justify-center mb-16 gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FolderHeart className="text-pink-500 w-8 h-8" />
          <h2 className="text-4xl handwritten text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 text-center">
            Our Memories
          </h2>
        </motion.div>
        
        {/* Albums List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albumsLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="relative h-80 bg-gray-800/50 animate-pulse rounded-lg"></div>
            ))
          ) : albumsError ? (
            <div className="col-span-3 text-center py-8 glass-effect rounded-xl p-8">
              <p className="text-pink-300">Unable to fetch albums. Our memories are there, just momentarily hidden.</p>
            </div>
          ) : albums.length > 0 ? (
            // Display albums if available
            albums.map((album: Album) => (
              <motion.div
                key={album._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <AlbumCard 
                  id={album._id}
                  title={album.title}
                  description={album.description || ""}
                  coverImage={album.coverImage || ""}
                  itemsCount={album.itemsCount || 0}
                  date={album._createdAt ? 
                    format(new Date(album._createdAt), "MMMM d, yyyy") : 
                    undefined}
                />
              </motion.div>
            ))
          ) : (
            // Empty state with call-to-action
            <div className="col-span-3 love-card text-center py-8">
              <p className="text-gray-300 mb-4">Create your first photo album to start collecting your special memories.</p>
              <button 
                onClick={() => {
                  const button = document.querySelector('.createContentButton');
                  if (button instanceof HTMLElement) {
                    button.click();
                  }
                }}
                className="love-button mt-4"
              >
                Create Album
              </button>
            </div>
          )}
        </div>
        
        {/* Featured Gallery Items */}
        <div className="mt-20">
          <motion.div 
            className="flex items-center justify-center mb-10 gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Camera className="text-pink-500 w-6 h-6" />
            <h3 className="text-2xl handwritten text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 text-center">
              Featured Moments
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {itemsLoading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-800/50 animate-pulse rounded-lg"></div>
              ))
            ) : itemsError ? (
              <div className="col-span-4 text-center py-8 glass-effect rounded-xl p-6">
                <p className="text-pink-300">Unable to load featured moments. Our gallery will be back soon.</p>
              </div>
            ) : featuredItems.length > 0 ? (
              // Display gallery items if available
              featuredItems.map((item: GalleryItemType, index: number) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="mobile-tilt"
                >
                  <GalleryItem 
                    id={item._id}
                    title={item.title || "Special Moment"}
                    imageUrl={item.thumbnailUrl || item.mediaUrl}
                    reactionCount={
                      item.reactions?.reduce(
                        (sum: number, reaction: any) => sum + (reaction.count || 0), 0
                      ) || 0
                    }
                  />
                </motion.div>
              ))
            ) : (
              // Empty state with call-to-action
              <div className="col-span-4 love-card text-center py-8">
                <p className="text-gray-300 mb-4">Your gallery is waiting for your first special moment.</p>
                <button 
                  onClick={() => {
                    const button = document.querySelector('.createContentButton');
                    if (button instanceof HTMLElement) {
                      button.click();
                    }
                  }}
                  className="love-button mt-4"
                >
                  Upload Memory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoriesSection;
import { motion } from "framer-motion";
import { FolderHeart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateContentModal } from "./CreateContentModal";

interface Album {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  theme: string;
}

export default function MemoriesSection() {
  const [showModal, setShowModal] = useState(false);
  
  // Dummy data - in a real app, this would come from your API
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <section id="memories-section" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-pink-50/30 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex items-center justify-center mb-12 gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FolderHeart className="text-pink-500 w-8 h-8" />
          <h2 className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 text-center">
            Our Memories
          </h2>
        </motion.div>
        
        {/* Albums List */}
        {albums.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <motion.div
                key={album.id}
                className="relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: album.coverImage 
                      ? `url(${album.coverImage})` 
                      : 'linear-gradient(to right bottom, #ff8a8a, #ffc1c1)' 
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-semibold text-white mb-2">{album.title}</h3>
                  {album.description && (
                    <p className="text-white/80 text-sm line-clamp-2 mb-3">{album.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">
                      {album.itemCount} {album.itemCount === 1 ? 'item' : 'items'}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    >
                      View Album
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed border-pink-200 bg-pink-50/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <p className="text-lg text-pink-800 mb-2">No memory albums yet</p>
              <p className="text-gray-500">Create your first album to start collecting your precious memories</p>
            </div>
            
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Album
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Create Album Modal */}
      <CreateContentModal
        open={showModal}
        onOpenChange={setShowModal}
        contentType="album"
        onSuccess={() => {
          // In a real app, you would refresh the album list here
          // For now, we'll just close the modal
        }}
      />
    </section>
  );
}

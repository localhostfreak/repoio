import { useQuery } from "@tanstack/react-query";
import AlbumCard from "./AlbumCard";
import GalleryItem from "./GalleryItem";
import { motion } from "framer-motion";
import { format } from "date-fns";

const MemoriesSection = () => {
  const { data: albums = [], isLoading: albumsLoading } = useQuery({
    queryKey: ["/api/albums"],
  });

  const { data: featuredItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/gallery/featured"],
  });

  return (
    <section id="memories" className="py-20 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFF5F5] to-white"></div>
      
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-playfair text-[#FF6B6B] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Our Memories
        </motion.h2>
        
        {/* Albums List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albumsLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="relative h-80 bg-gray-100 animate-pulse rounded-lg"></div>
            ))
          ) : albums.length > 0 ? (
            albums.map((album: any) => (
              <AlbumCard 
                key={album._id}
                id={album._id}
                title={album.title}
                description={album.description}
                coverImage={album.coverImage}
                itemsCount={album.itemsCount}
                date={album._createdAt ? format(new Date(album._createdAt), "MMMM d, yyyy") : undefined}
              />
            ))
          ) : (
            <>
              {/* Default album examples when no data is available */}
              <AlbumCard 
                id="1"
                title="First Date"
                description="That magical evening when we first met. The cafe, the unexpected rain, and the beginning of our journey together."
                coverImage="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                itemsCount={12}
                date="April 15, 2022"
              />
              
              <AlbumCard 
                id="2"
                title="Our Vacation"
                description="Two weeks of pure bliss exploring the coastline, watching sunsets, and falling even deeper in love."
                coverImage="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                itemsCount={24}
                date="July 12, 2022"
              />
              
              <AlbumCard 
                id="3"
                title="Anniversary"
                description="Celebrating one year of us with a surprise dinner, dancing under the stars, and promises for the future."
                coverImage="https://images.unsplash.com/photo-1522673607200-164d1b3ce551?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                itemsCount={18}
                date="April 15, 2023"
              />
            </>
          )}
        </div>
        
        {/* Featured Gallery Items */}
        <div className="mt-20">
          <motion.h3 
            className="text-2xl font-playfair text-[#FF1493] text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Featured Moments
          </motion.h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {itemsLoading ? (
              Array(4).fill(0).map((_, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 animate-pulse rounded-lg"></div>
              ))
            ) : featuredItems.length > 0 ? (
              featuredItems.map((item: any) => (
                <GalleryItem 
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  imageUrl={item.thumbnailUrl || item.mediaUrl}
                  reactionCount={item.reactions?.reduce((sum: number, reaction: any) => sum + reaction.count, 0) || 0}
                />
              ))
            ) : (
              <>
                {/* Default gallery items when no data is available */}
                <GalleryItem 
                  id="1"
                  title="Sunset Beach Walk"
                  imageUrl="https://images.unsplash.com/photo-1530653333484-8e3c89cd2f45?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  reactionCount={12}
                />
                
                <GalleryItem 
                  id="2"
                  title="Coffee Shop Date"
                  imageUrl="https://images.unsplash.com/photo-1518911710364-17ec553bde5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  reactionCount={8}
                />
                
                <GalleryItem 
                  id="3"
                  title="Picnic in the Park"
                  imageUrl="https://images.unsplash.com/photo-1523301551780-cd17359a95d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  reactionCount={15}
                />
                
                <GalleryItem 
                  id="4"
                  title="Stargazing Night"
                  imageUrl="https://images.unsplash.com/photo-1593239782798-5027b7623c59?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  reactionCount={21}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoriesSection;

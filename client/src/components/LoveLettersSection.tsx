import { useQuery } from "@tanstack/react-query";
import LoveLetterCard from "./LoveLetterCard";
import { motion } from "framer-motion";
import { Link } from "wouter";

const LoveLettersSection = () => {
  const { data: letters = [], isLoading } = useQuery({
    queryKey: ["/api/love-letters"],
  });

  return (
    <section id="love-letters" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-playfair text-[#FF6B6B] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Love Letters
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          {isLoading ? (
            Array(2).fill(0).map((_, idx) => (
              <div key={idx} className="relative h-96 bg-gray-100 animate-pulse rounded-lg"></div>
            ))
          ) : letters.length > 0 ? (
            letters.slice(0, 2).map((letter: any) => (
              <LoveLetterCard 
                key={letter._id}
                title={letter.title}
                date={letter.createdAt}
                content={Array.isArray(letter.content) 
                  ? letter.content.map((block: any) => block.children?.map((child: any) => child.text).join("")).join("\n")
                  : letter.content || ""}
                coverTitle={letter.title || "From My Heart to Yours"}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-[#4A4A4A]">No love letters yet. The first one is coming soon!</p>
            </div>
          )}
          
          {!isLoading && letters.length === 0 && (
            <>
              {/* Default letter examples when no data is available */}
              <LoveLetterCard 
                title="To My Beloved"
                date={new Date().toISOString()}
                content="The distance between us seems vast, yet in my heart you are always near. Every morning I wake up thinking of your smile, and each night I fall asleep wrapped in memories of your embrace."
                coverTitle="From My Heart to Yours"
              />
              
              <LoveLetterCard 
                title="My Dearest"
                date={new Date().toISOString()}
                content="Do you remember our first date? The way the stars seemed to shine just for us that night? I was so nervous, yet the moment I saw you, all my worries melted away."
                coverTitle="Memories of Us"
              />
            </>
          )}
        </div>
        
        {letters.length > 2 && (
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/letters" className="inline-block text-[#FF1493] border border-[#FF1493] hover:bg-[#FF1493] hover:text-white rounded-full px-6 py-2 transition-colors duration-300">
              View All Letters
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LoveLettersSection;

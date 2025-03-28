const ParallaxSection = ({ children }: ParallaxSectionProps) => {
  return (
    <motion.div className="w-full relative">
      {children}
    </motion.div>
  );
};
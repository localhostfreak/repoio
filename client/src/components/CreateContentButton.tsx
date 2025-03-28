
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import CreateContentModal from './CreateContentModal';

export default function CreateContentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl bg-pink-600 hover:bg-pink-700 p-0 flex items-center justify-center z-50"
        aria-label="Create new content"
      >
        <Plus size={24} className="text-white" />
      </Button>
      
      <CreateContentModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSuccess={() => setIsModalOpen(false)}
        contentType="album"
      />
    </>
  );
}

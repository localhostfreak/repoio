import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import CreateContentModal from './CreateContentModal';

function CreateContentButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg z-10 p-0 flex items-center justify-center"
        aria-label="Create new content"
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>

      <CreateContentModal 
        open={showModal} 
        onOpenChange={setShowModal} 
        onSuccess={() => setShowModal(false)}
      />
    </>
  );
}

export default CreateContentButton;
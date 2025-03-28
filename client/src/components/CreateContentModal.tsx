
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateAlbumForm } from "./CreateAlbumForm";
import { CreateMemoryForm } from "./CreateMemoryForm";

export type ContentType = 'album' | 'memory';

export interface CreateContentModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentType?: ContentType;
  onSuccess?: () => void;
  type?: ContentType;
}

export const CreateContentModal = ({
  open, 
  isOpen,
  onOpenChange, 
  onSuccess,
  contentType = 'album',
  type
}: CreateContentModalProps) => {
  const isModalOpen = open ?? isOpen ?? false;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
  };

  const activeTab = type || contentType;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gray-900 border border-gray-800 text-white">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-100">
            {activeTab === 'album' ? 'Create New Album' : 'Create New Memory'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4 p-1 mx-6 bg-gray-800 rounded-md">
            <TabsTrigger 
              value="album" 
              className="data-[state=active]:bg-pink-600 py-2"
            >
              Album
            </TabsTrigger>
            <TabsTrigger 
              value="memory" 
              className="data-[state=active]:bg-pink-600 py-2"
            >
              Memory
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="album" className="m-0 px-6 pb-6">
            <CreateAlbumForm onSuccess={onSuccess} />
          </TabsContent>
          
          <TabsContent value="memory" className="m-0 px-6 pb-6">
            <CreateMemoryForm onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

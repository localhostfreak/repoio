import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateAlbumForm } from "./CreateAlbumForm";
import { CreateMemoryForm } from "./CreateMemoryForm";

export type ContentType = 'album' | 'memory';

export interface CreateContentModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  contentType?: ContentType;
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
  const [selectedTab, setSelectedTab] = useState<ContentType>(activeTab);

  const handleTabChange = (value: string) => {
    setSelectedTab(value as ContentType);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Create New {selectedTab === 'album' ? 'Photo Album' : 'Memory'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {selectedTab === 'album'
              ? 'Create a new album to organize and share your special moments'
              : 'Add a new memory to your collection'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} value={selectedTab} onValueChange={handleTabChange} className="w-full mt-4">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="album">Photo Album</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>

          <TabsContent value="album" className="mt-2">
            <CreateAlbumForm onSuccess={onSuccess} />
          </TabsContent>

          <TabsContent value="memory" className="mt-2">
            <CreateMemoryForm onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
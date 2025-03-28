
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Image, Headphones, PenLine } from "lucide-react";
import CreateAlbumForm from "./CreateAlbumForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type ContentType = 'album' | 'photo' | 'audio' | 'letter';

interface CreateContentModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSuccess?: () => void;
  contentType?: ContentType;
  type?: ContentType;
}

export function CreateContentModal({ 
  open, 
  isOpen,
  onOpenChange, 
  onClose,
  onSuccess,
  contentType = 'album',
  type
}: CreateContentModalProps) {
  // Support both prop patterns (for backward compatibility)
  const isModalOpen = open ?? isOpen ?? false;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen && onClose) onClose();
  };
  const activeContentType = contentType ?? type ?? 'album';
  const [activeTab, setActiveTab] = useState<ContentType>(activeContentType);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] mx-auto">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 bg-pink-50 space-y-2 sm:space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-serif text-pink-800">Create New Content</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-pink-700">
            Choose a content type below to add to your collection.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeContentType} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-pink-50/60 border-y border-pink-100 p-0">
            <TabsTrigger value="album" className="data-[state=active]:bg-pink-100">
              <Album className="mr-2 h-4 w-4" />
              Album
            </TabsTrigger>
            <TabsTrigger value="photo" className="data-[state=active]:bg-pink-100">
              <Image className="mr-2 h-4 w-4" />
              Photo
            </TabsTrigger>
            <TabsTrigger value="audio" className="data-[state=active]:bg-pink-100">
              <Headphones className="mr-2 h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="letter" className="data-[state=active]:bg-pink-100">
              <PenLine className="mr-2 h-4 w-4" />
              Letter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="album" className="mt-0 p-6">
            <CreateAlbumForm onSuccess={handleSuccess} onCancel={handleClose} />
          </TabsContent>
          
          <TabsContent value="photo" className="mt-0 p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Photo upload feature coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="mt-0 p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Audio recording feature coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="letter" className="mt-0 p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Letter writing feature coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default CreateContentModal;

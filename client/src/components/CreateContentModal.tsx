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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  contentType?: ContentType;
}

export function CreateContentModal({ 
  open, 
  onOpenChange, 
  onSuccess,
  contentType = 'album' 
}: CreateContentModalProps) {
  const [activeTab, setActiveTab] = useState<ContentType>(contentType);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const onClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[550px] rounded-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 bg-pink-50 space-y-2 sm:space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-serif text-pink-800">Create New Content</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-pink-700">
            Choose a content type below to add to your collection.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
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
            <CreateAlbumForm onSuccess={handleSuccess} onCancel={onClose} />
          </TabsContent>

          <TabsContent value="photo" className="mt-0 p-6">
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <Image className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Photo Upload</h3>
              <p className="text-gray-600">
                This feature is coming soon! You'll be able to upload individual photos and add them to albums.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-0 p-6">
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <Headphones className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Audio Recording</h3>
              <p className="text-gray-600">
                This feature is coming soon! You'll be able to record or upload audio memories.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="letter" className="mt-0 p-6">
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <PenLine className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Love Letter</h3>
              <p className="text-gray-600">
                This feature is coming soon! You'll be able to write and design beautiful digital love letters.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default CreateContentModal;
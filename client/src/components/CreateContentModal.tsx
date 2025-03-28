
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

export type ContentType = 'album' | 'photo' | 'audio' | 'letter' | 'loveLetter' | 'galleryItem' | 'audioMessage';

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
  const [activeTab, setActiveTab] = useState(contentType);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-gradient-to-br from-pink-50 to-white">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-serif text-center text-pink-800">
            Create New Memory
          </DialogTitle>
          <VisuallyHidden>Create New Memory</VisuallyHidden>
          <DialogDescription className="text-center text-pink-600">
            Choose what type of memory you want to create
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
          <TabsList className="grid grid-cols-4 h-auto p-1 mx-4 mb-0 bg-pink-50 rounded-lg">
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
            <CreateAlbumForm onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
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
              <h3 className="text-xl font-medium mb-2">Audio Message</h3>
              <p className="text-gray-600">
                This feature is coming soon! You'll be able to record and share voice messages.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="letter" className="mt-0 p-6">
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <PenLine className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Love Letter</h3>
              <p className="text-gray-600">
                This feature is coming soon! You'll be able to write and share beautiful love letters.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default CreateContentModal;

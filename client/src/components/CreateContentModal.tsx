
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Album, Photo, Headphones, PenLine } from "lucide-react";
import CreateAlbumForm from "./CreateAlbumForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateContentModal({ isOpen, onClose }: CreateContentModalProps) {
  const [activeTab, setActiveTab] = useState("album");

  // Handle form submission success
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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

        <Tabs
          defaultValue="album"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mx-6">
            <TabsTrigger value="album" className="data-[state=active]:bg-pink-100">
              <Album className="mr-2 h-4 w-4" />
              Album
            </TabsTrigger>
            <TabsTrigger value="photo" className="data-[state=active]:bg-pink-100">
              <Photo className="mr-2 h-4 w-4" />
              Photo
            </TabsTrigger>
            <TabsTrigger value="audio" className="data-[state=active]:bg-pink-100">
              <Headphones className="mr-2 h-4 w-4" />
              Voice
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
              <Photo className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Photo Upload</h3>
              <p className="text-gray-600">
                This feature is coming soon! You'll be able to upload individual photos and add them to albums.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="mt-0 p-6">
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <Headphones className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Voice Messages</h3>
              <p className="text-gray-600">
                This feature is coming soon! You'll be able to record and send voice messages to express your feelings.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="letter" className="mt-0 p-6">
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <PenLine className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Love Letters</h3>
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

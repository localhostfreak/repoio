import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Headphones, PenLine, Sun, Moon, Heart } from "lucide-react";
import CreateAlbumForm from "./CreateAlbumForm";
import { ContentType } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CreateContentModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (data: any) => void;
  contentType?: ContentType;
  type?: ContentType;
}

export default function CreateContentModal({
  open, 
  isOpen,
  onOpenChange, 
  onSuccess,
  contentType = 'album',
  type
}: CreateContentModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
  };
  const activeContentType = contentType ?? type ?? 'album';
  const [activeTab, setActiveTab] = useState<ContentType>(activeContentType);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const heartEmojis = ["💖", "💕", "❤️", "💘", "💓", "💞", "💝"];
  const [randomEmoji, setRandomEmoji] = useState(heartEmojis[0]);

  useEffect(() => {
    setRandomEmoji(heartEmojis[Math.floor(Math.random() * heartEmojis.length)]);
  }, [isModalOpen]);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess(activeTab);
    }
  };

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
  };

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      setIsDarkMode(!isDarkMode);
    }
  };

  const loveMessages = {
    album: "Let's create a beautiful collection of our memories together",
    photo: "A picture is worth a thousand words, but your smile is priceless",
    audio: "I love hearing your voice, let's capture those magical sounds",
    letter: "Express your feelings in a love letter that will last forever"
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[700px] p-0 relative">
        <div className="absolute right-12 top-6 flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch 
            checked={isDarkMode} 
            onCheckedChange={toggleDarkMode} 
            id="dark-mode" 
          />
          <Moon className="h-4 w-4" />
        </div>

        <DialogHeader className="p-6 pb-0 relative">
          <div className="absolute right-0 top-0 flex items-center space-x-2 mr-2">
            <Label htmlFor="theme-mode" className="text-xs">Dark</Label>
            <Switch id="theme-mode" className="data-[state=checked]:bg-pink-500" />
            <Label htmlFor="theme-mode" className="text-xs">Light</Label>
          </div>
          <DialogTitle className="text-2xl flex items-center">
            <Heart className="mr-2 text-pink-500 h-5 w-5" /> 
            <span>Create Something Special {randomEmoji}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeContentType} className="mt-3" onValueChange={(value) => setActiveTab(value as ContentType)}>
          <TabsList className="grid grid-cols-4 mx-6">
            <TabsTrigger value="album">Album</TabsTrigger>
            <TabsTrigger value="photo">Photo</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="letter">Letter</TabsTrigger>
          </TabsList>

          <div className="text-center italic text-sm text-pink-500 mt-2">
            {loveMessages[activeTab]}
          </div>

          <TabsContent value="album" className="mt-0 p-6">
            <CreateAlbumForm onSuccess={handleSuccess} onCancel={handleClose} />
          </TabsContent>

          <TabsContent value="photo" className="mt-0 p-6">
            <div className="text-center py-8 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Image className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Photo Upload</h3>
              <p className="text-gray-600 dark:text-gray-300">
                This feature is coming soon! You'll be able to upload precious photos of our moments together.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-0 p-6">
            <div className="text-center py-8 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Headphones className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Audio Recording</h3>
              <p className="text-gray-600 dark:text-gray-300">
                This feature is coming soon! Record sweet messages or our favorite songs to cherish forever.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="letter" className="mt-0 p-6">
            <div className="text-center py-8 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <PenLine className="w-12 h-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Love Letter</h3>
              <p className="text-gray-600 dark:text-gray-300">
                This feature is coming soon! Pour your heart out in a beautiful digital love letter.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
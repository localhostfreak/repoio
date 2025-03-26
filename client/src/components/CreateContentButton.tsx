import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Heart, Image, Mic, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateContentModal, ContentType } from './CreateContentModal';

export function CreateContentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('loveLetter');

  const handleOpenModal = (type: ContentType) => {
    setContentType(type);
    setIsModalOpen(true);
  };

  const handleSuccessfulCreation = () => {
    // Any additional logic after successful content creation
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white shadow-md fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 flex items-center justify-center">
            <PlusCircle className="h-8 w-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border border-pink-200 shadow-xl">
          <DropdownMenuLabel className="text-pink-800 font-serif">Create Content</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-pink-100" />
          <DropdownMenuItem 
            className="cursor-pointer flex items-center py-2 hover:bg-pink-50"
            onClick={() => handleOpenModal('loveLetter')}
          >
            <Heart className="mr-2 h-4 w-4 text-pink-600" />
            <span>Write a Love Letter</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center py-2 hover:bg-pink-50"
            onClick={() => handleOpenModal('galleryItem')}
          >
            <Image className="mr-2 h-4 w-4 text-blue-500" />
            <span>Share a Photo/Video</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center py-2 hover:bg-pink-50"
            onClick={() => handleOpenModal('audioMessage')}
          >
            <Mic className="mr-2 h-4 w-4 text-red-500" />
            <span>Record Voice Message</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center py-2 hover:bg-pink-50"
            onClick={() => handleOpenModal('album')}
          >
            <BookOpen className="mr-2 h-4 w-4 text-purple-500" />
            <span>Create Memory Album</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateContentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        contentType={contentType}
        onSuccess={handleSuccessfulCreation}
      />
    </>
  );
}

export default CreateContentButton;
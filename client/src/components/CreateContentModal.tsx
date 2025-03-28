import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heart, Image, Mic, BookOpen } from "lucide-react";
import CreateAlbumForm from "./CreateAlbumForm";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export type ContentType = 'loveLetter' | 'galleryItem' | 'audioMessage' | 'album';

interface CreateContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: ContentType;
  onSuccess?: () => void;
}

export function CreateContentModal({
  open,
  onOpenChange,
  contentType,
  onSuccess
}: CreateContentModalProps) {
  const renderContentForm = () => {
    switch (contentType) {
      case 'album':
        return (
          <CreateAlbumForm 
            onSuccess={() => {
              if (onSuccess) onSuccess();
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        );
      case 'loveLetter':
      case 'galleryItem':
      case 'audioMessage':
      default:
        return (
          <div className="py-4">
            <p className="text-center text-gray-500">
              Form for {contentType} content creation will be implemented soon.
            </p>
          </div>
        );
    }
  };

  if (contentType === 'album') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-3xl p-0 bg-transparent border-none shadow-none" aria-describedby="dialog-description-album"> 
          <VisuallyHidden>
            <DialogTitle id="dialog-description-album">Create New Album</DialogTitle> 
          </VisuallyHidden>
          {renderContentForm()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl" aria-describedby="dialog-description"> 
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {contentType === 'loveLetter' && (
              <>
                <Heart className="text-pink-500" />
                <span>Write a Love Letter</span>
              </>
            )}
            {contentType === 'galleryItem' && (
              <>
                <Image className="text-blue-500" />
                <span>Share a Photo/Video</span>
              </>
            )}
            {contentType === 'audioMessage' && (
              <>
                <Mic className="text-red-500" />
                <span>Record Voice Message</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription id="dialog-description"> 
            {contentType === 'loveLetter' && "Express your feelings in a beautiful letter"}
            {contentType === 'galleryItem' && "Share photos and videos of your special moments"}
            {contentType === 'audioMessage' && "Record your voice for your loved one to hear"}
          </DialogDescription>
        </DialogHeader>

        {renderContentForm()}
      </DialogContent>
    </Dialog>
  );
}
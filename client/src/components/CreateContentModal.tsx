import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CreateLoveLetterForm from './CreateLoveLetterForm';
import UploadGalleryItemForm from './UploadGalleryItemForm';
import RecordAudioMessageForm from './RecordAudioMessageForm';
import CreateAlbumForm from './CreateAlbumForm';

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
  
  const getTitle = () => {
    switch (contentType) {
      case 'loveLetter':
        return 'Write a Love Letter';
      case 'galleryItem':
        return 'Share a Photo or Video';
      case 'audioMessage':
        return 'Record an Audio Message';
      case 'album':
        return 'Create a Memory Album';
      default:
        return 'Create Content';
    }
  };
  
  const getDescription = () => {
    switch (contentType) {
      case 'loveLetter':
        return 'Express your feelings in words that will last forever';
      case 'galleryItem':
        return 'Share your special moments through photos and videos';
      case 'audioMessage':
        return 'Send your voice across the distance';
      case 'album':
        return 'Organize your memories into beautiful collections';
      default:
        return 'Create and share meaningful content';
    }
  };
  
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  const renderForm = () => {
    switch (contentType) {
      case 'loveLetter':
        return (
          <CreateLoveLetterForm 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        );
      case 'galleryItem':
        return (
          <UploadGalleryItemForm 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        );
      case 'audioMessage':
        return (
          <RecordAudioMessageForm 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        );
      case 'album':
        return (
          <CreateAlbumForm 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        );
      default:
        return <div>Select a content type to create</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 bg-transparent border-none shadow-none">
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}

export default CreateContentModal;
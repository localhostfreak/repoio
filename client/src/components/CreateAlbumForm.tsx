import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { createAlbum } from '@/lib/sanity-client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface CreateAlbumFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAlbumForm({ onSuccess, onCancel }: CreateAlbumFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast({
        title: "Error",
        description: "Please provide a title for your album",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const album = {
        title,
        description: description || undefined,
      };

      // Send to Sanity
      const result = await createAlbum(album);

      if (!result.success) {
        throw new Error('Failed to create album in Sanity');
      }

      // Show success message
      toast({
        title: "Success",
        description: "Your memory album has been created!",
        variant: "default"
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['albums'] });

      // Reset form and call success callback
      setTitle('');
      setDescription('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating album:', error);
      toast({
        title: "Error",
        description: "Failed to create your album. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-pink-200 shadow-lg">
      <CardHeader className="bg-pink-50 rounded-t-lg p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-serif text-pink-800">Create a Memory Album</CardTitle>
        <CardDescription className="text-sm sm:text-base">Organize your cherished memories into a beautiful collection</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:pt-6 sm:px-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="title" className="text-pink-700">Album Title</Label>
            <Input
              id="title"
              placeholder="Give your album a memorable title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
            <VisuallyHidden>Album Title</VisuallyHidden>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-pink-700">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this album means to you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>

          <div className="mt-4 border border-pink-200 rounded-md p-2">
            <p className="text-sm text-pink-700 mb-2">Preview:</p>
            <div className="bg-white rounded-md p-4 shadow-sm">
              <h3 className="font-semibold text-lg">{title || "Your Album Title"}</h3>
              <p className="text-gray-600 text-sm mt-1">{description || "Album description will appear here"}</p>
              <div className="mt-3 bg-gray-100 h-32 rounded flex items-center justify-center">
                <p className="text-gray-400">Album Cover Image</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You'll be able to add photos to this album after creation
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-pink-100 p-4 sm:pt-4 sm:px-6">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-pink-300 text-pink-700 hover:bg-pink-50 text-sm sm:text-base px-3 sm:px-4"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm sm:text-base px-3 sm:px-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Album"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default CreateAlbumForm;
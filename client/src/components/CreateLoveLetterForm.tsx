import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';

interface CreateLoveLetterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateLoveLetterForm({ onSuccess, onCancel }: CreateLoveLetterFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format content as a Portable Text array
      const formattedContent = [
        {
          _type: "block",
          style: "normal",
          children: [
            {
              _type: "span",
              text: content
            }
          ]
        }
      ];
      
      // Create love letter object
      const loveLetter = {
        title,
        content: formattedContent,
        createdAt: new Date().toISOString(),
        effects: ["hearts", "sparkles"], // Default effects
      };
      
      // Send to API
      const response = await apiRequest('/api/love-letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loveLetter)
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Your love letter has been sent!",
        variant: "default"
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/love-letters'] });
      
      // Reset form and call success callback
      setTitle('');
      setContent('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating love letter:', error);
      toast({
        title: "Error",
        description: "Failed to send your love letter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-pink-200 shadow-lg">
      <CardHeader className="bg-pink-50 rounded-t-lg">
        <CardTitle className="text-2xl font-serif text-pink-800">Write a Love Letter</CardTitle>
        <CardDescription>Express your feelings in a beautiful love letter</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-pink-700">Title</Label>
            <Input
              id="title"
              placeholder="Give your letter a meaningful title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-pink-700">Your Message</Label>
            <Textarea
              id="content"
              placeholder="Write your love letter here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] border-pink-200 focus:border-pink-400"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-pink-100 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-pink-300 text-pink-700 hover:bg-pink-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-pink-600 hover:bg-pink-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Love Letter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default CreateLoveLetterForm;

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface CreateMemoryFormProps {
  onSuccess?: () => void;
}

export const CreateMemoryForm: React.FC<CreateMemoryFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to create a memory
    // For now, just show a success message
    setTimeout(() => {
      toast({
        title: "Memory created",
        description: "Your memory has been created successfully.",
        variant: "default"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="memoryTitle">Title</Label>
        <Input id="memoryTitle" placeholder="Enter memory title" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="memoryDescription">Description</Label>
        <Textarea 
          id="memoryDescription" 
          placeholder="Describe this special memory..."
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="memoryImage">Upload Image</Label>
        <Input id="memoryImage" type="file" accept="image/*" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="memoryDate">Date</Label>
        <Input id="memoryDate" type="date" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="memoryLocation">Location</Label>
        <Input id="memoryLocation" placeholder="Where did this memory take place?" />
      </div>
      
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-pink-600">
        Create Memory
      </Button>
    </form>
  );
};

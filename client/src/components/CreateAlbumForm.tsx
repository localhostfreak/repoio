import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from "@/components/ui/switch";
import { createAlbum } from '@/lib/sanity-client';

interface CreateAlbumFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAlbumForm({ onSuccess, onCancel }: CreateAlbumFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
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
        coverImage: coverImageUrl || undefined,
        isPrivate
      };
      
      // Send to Sanity
      const result = await createAlbum(album);
      
      if (!result.success) {
        throw new Error('Failed to create album in Sanity');
      }
      
      // Show success message
      toast({
        title: "Success",
        description: "Your album has been created in Sanity!",
        variant: "default"
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      
      // Reset form and call success callback
      setTitle('');
      setDescription('');
      setCoverImageUrl('');
      setIsPrivate(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating album:', error);
      toast({
        title: "Error",
        description: "Failed to create your album in Sanity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-pink-200 shadow-lg">
      <CardHeader className="bg-pink-50 rounded-t-lg">
        <CardTitle className="text-2xl font-serif text-pink-800">Create a Memory Album</CardTitle>
        <CardDescription>Organize your cherished memories into a beautiful collection</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-pink-700">Album Title</Label>
            <Input
              id="title"
              placeholder="Give your album a memorable title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-pink-700">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this album means to you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-pink-700">Cover Image URL (optional)</Label>
            <Input
              id="coverImage"
              placeholder="https://example.com/your-image.jpg"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="border-pink-200 focus:border-pink-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              For the demo, enter any image URL. In a complete implementation, we would have an image upload feature.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isPrivate"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="isPrivate" className="text-pink-700">Make this album private</Label>
          </div>
          
          {coverImageUrl && (
            <div className="mt-4 border border-pink-200 rounded-md p-2">
              <p className="text-sm text-pink-700 mb-2">Cover Image Preview:</p>
              <img 
                src={coverImageUrl} 
                alt="Album Cover Preview" 
                className="max-h-64 rounded-md mx-auto"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
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
            {isSubmitting ? "Creating..." : "Create Album"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default CreateAlbumForm;


// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "@/components/ui/use-toast";

// // Define form validation schema
// const albumSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters").max(50, "Title cannot exceed 50 characters"),
//   description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
//   coverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
//   isPrivate: z.boolean().default(false),
//   theme: z.string().default("default"),
// });

// type AlbumFormValues = z.infer<typeof albumSchema>;

// interface CreateAlbumFormProps {
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// export function CreateAlbumForm({ onSuccess, onCancel }: CreateAlbumFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const { register, handleSubmit, formState: { errors } } = useForm<AlbumFormValues>({
//     resolver: zodResolver(albumSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       coverImage: "",
//       isPrivate: false,
//       theme: "default"
//     }
//   });

//   const onSubmit = async (data: AlbumFormValues) => {
//     setIsSubmitting(true);
    
//     try {
//       // Here you would connect with your backend API to save the album
//       // For now, let's mock a successful API call
//       await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API delay
      
//       toast({
//         title: "Album Created!",
//         description: `"${data.title}" has been created and is ready for your memories.`,
//         variant: "default",
//       });
      
//       if (onSuccess) onSuccess();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create album. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-2xl mx-auto border-pink-200 shadow-lg">
//       <CardHeader className="bg-pink-50 rounded-t-lg">
//         <CardTitle className="text-2xl font-serif text-pink-800">Create a Memory Album</CardTitle>
//         <CardDescription>Organize your cherished memories into a beautiful collection</CardDescription>
//       </CardHeader>
      
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <CardContent className="space-y-4 pt-6">
//           <div className="space-y-2">
//             <Label htmlFor="title" className="text-pink-700">Album Title</Label>
//             <Input
//               id="title"
//               placeholder="Give your album a memorable title"
//               {...register("title")}
//               className="border-pink-200 focus:border-pink-400"
//             />
//             {errors.title && (
//               <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
//             )}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="description" className="text-pink-700">Description (optional)</Label>
//             <Textarea
//               id="description"
//               placeholder="Describe what this album means to you..."
//               {...register("description")}
//               className="border-pink-200 focus:border-pink-400 min-h-24"
//             />
//             {errors.description && (
//               <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
//             )}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="coverImage" className="text-pink-700">Cover Image URL (optional)</Label>
//             <Input
//               id="coverImage"
//               placeholder="https://example.com/your-image.jpg"
//               {...register("coverImage")}
//               className="border-pink-200 focus:border-pink-400"
//             />
//             {errors.coverImage && (
//               <p className="text-sm text-red-500 mt-1">{errors.coverImage.message}</p>
//             )}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="theme" className="text-pink-700">Album Theme</Label>
//             <Select defaultValue="default" {...register("theme")}>
//               <SelectTrigger className="border-pink-200 focus:border-pink-400">
//                 <SelectValue placeholder="Select a theme" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="default">Classic Romance</SelectItem>
//                 <SelectItem value="vintage">Vintage Memories</SelectItem>
//                 <SelectItem value="minimalist">Minimalist</SelectItem>
//                 <SelectItem value="colorful">Vibrant Colors</SelectItem>
//                 <SelectItem value="monochrome">Black & White</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
          
//           <div className="flex items-center space-x-2 mt-6">
//             <Checkbox id="isPrivate" {...register("isPrivate")} />
//             <Label htmlFor="isPrivate" className="text-sm text-pink-700">
//               Make this album private (only visible to you)
//             </Label>
//           </div>
//         </CardContent>
        
//         <CardFooter className="flex justify-between border-t border-pink-100 pt-4">
//           <Button 
//             type="button" 
//             variant="outline" 
//             onClick={onCancel}
//             className="border-pink-300 text-pink-700 hover:bg-pink-50"
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit" 
//             className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <span className="flex items-center gap-1">
//                 <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Creating...
//               </span>
//             ) : "Create Album"}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }

// export default CreateAlbumForm;

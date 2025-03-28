import { useToast as useToastUI } from "@/hooks/use-toast";

export const useToast = () => {
  const { toast } = useToastUI();

  const showToast = ({ 
    title, 
    description, 
    type = "default" 
  }: { 
    title: string; 
    description?: string; 
    type?: "default" | "success" | "error" | "warning" | "info" 
  }) => {
    toast({
      title,
      description,
      variant: type === "default" ? "default" : "destructive",
    });
  };

  return { showToast };
};
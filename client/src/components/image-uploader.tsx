import { Upload, XCircle } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { ExtractedElement } from "@/pages/home";

interface ImageUploaderProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  setIsProcessing: (processing: boolean) => void;
  onElementsExtracted: (elements: ExtractedElement[]) => void;
}

export function ImageUploader({
  selectedImage,
  setSelectedImage,
  setIsProcessing,
  onElementsExtracted
}: ImageUploaderProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PNG or JPG file"
      });
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image under 10MB"
      });
      return false;
    }

    return true;
  };

  const processImage = async (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setIsProcessing(true);

      // Simulate AI processing with mock data
      setTimeout(() => {
        const mockElements = [
          { type: 'font', name: 'Primary Font', details: 'Helvetica Neue, 24px Bold' },
          { type: 'color', name: 'Primary Blue', details: '#2563eb' },
          { type: 'shape', name: 'Hero Image', details: 'PNG, 1200x800px' },
          { type: 'effect', name: 'Shadow Effect', details: '0px 4px 6px rgba(0,0,0,0.1)' },
          { 
            type: 'palette', 
            name: 'Color Scheme', 
            details: 'Brand Colors',
            value: JSON.stringify([
              { color: '#2563eb', name: 'Primary' },
              { color: '#1d4ed8', name: 'Secondary' },
              { color: '#60a5fa', name: 'Accent' },
              { color: '#f8fafc', name: 'Background' }
            ])
          }
        ];

        onElementsExtracted(mockElements);
        setIsProcessing(false);

        toast({
          title: "Image analyzed successfully",
          description: "Design elements have been extracted"
        });
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  return (
    <Card className="relative">
      <div
        className={`
          p-8 rounded-lg transition-all duration-200 ease-in-out
          ${dragActive ? 'border-primary border-2' : 'border-2 border-dashed border-gray-200'}
          ${selectedImage ? 'bg-gray-50' : 'bg-white'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedImage ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button asChild className="cursor-pointer">
                <label>
                  Choose Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg"
                    onChange={handleChange}
                  />
                </label>
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Drop your image here or click to upload (PNG, JPG up to 10MB)
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => setSelectedImage(null)}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
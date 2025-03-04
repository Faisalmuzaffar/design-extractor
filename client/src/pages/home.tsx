import { ImageUploader } from "@/components/image-uploader";
import { ElementDisplay } from "@/components/element-display";
import { Separator } from "@/components/ui/separator";
import { Paintbrush } from "lucide-react";
import { useState } from "react";

export interface ExtractedElement {
  type: 'font' | 'color' | 'shape' | 'effect' | 'text' | 'palette';
  name: string;
  details: string;
  value?: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedElements, setExtractedElements] = useState<ExtractedElement[]>([]);

  const handleImageProcessed = (elements: ExtractedElement[]) => {
    setExtractedElements(elements);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Design Extractor
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ImageUploader
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setIsProcessing={setIsProcessing}
                onElementsExtracted={handleImageProcessed}
              />
            </div>
          </div>

          {/* Right Column - Extracted Elements */}
          <div>
            <ElementDisplay
              isProcessing={isProcessing}
              extractedElements={extractedElements}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
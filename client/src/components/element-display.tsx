import { Download, Palette, Type, ImageIcon, Settings2, Text, SwatchBook } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { ExtractedElement } from "@/pages/home";

interface ElementDisplayProps {
  isProcessing: boolean;
  extractedElements: ExtractedElement[];
}

export function ElementDisplay({ isProcessing, extractedElements }: ElementDisplayProps) {
  const renderElementIcon = (type: string) => {
    switch (type) {
      case 'font':
        return <Type className="h-5 w-5 text-primary" />;
      case 'color':
        return <Palette className="h-5 w-5 text-primary" />;
      case 'shape':
        return <ImageIcon className="h-5 w-5 text-primary" />;
      case 'effect':
        return <Settings2 className="h-5 w-5 text-primary" />;
      case 'text':
        return <Text className="h-5 w-5 text-primary" />;
      case 'palette':
        return <SwatchBook className="h-5 w-5 text-primary" />;
      default:
        return <ImageIcon className="h-5 w-5 text-primary" />;
    }
  };

  const renderPaletteColors = (value: string) => {
    try {
      const colors = JSON.parse(value);
      return (
        <div className="flex gap-2 mt-2">
          {colors.map((color: { color: string; name: string }, index: number) => (
            <div key={index} className="text-center">
              <div 
                className="w-8 h-8 rounded-full border border-gray-200" 
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
              <span className="text-xs text-gray-500 mt-1">{color.color}</span>
            </div>
          ))}
        </div>
      );
    } catch {
      return null;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Extracted Elements</h2>
      
      {isProcessing ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-gray-500">Analyzing image...</p>
          </div>
        </div>
      ) : extractedElements.length > 0 ? (
        <div className="space-y-4">
          {extractedElements.map((element, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="mr-3">
                {renderElementIcon(element.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{element.name}</h3>
                <p className="text-sm text-gray-500">{element.details}</p>
                {element.type === 'palette' && element.value && (
                  renderPaletteColors(element.value)
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[200px] flex items-center justify-center text-center text-gray-500">
          <div>
            <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Upload an image to see extracted elements</p>
          </div>
        </div>
      )}
    </Card>
  );
}

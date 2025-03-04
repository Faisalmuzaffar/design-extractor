import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Palette, Type, Download, Layers, Settings2, Text, SwatchBook } from 'lucide-react';

interface ExtractedElement {
  type: 'font' | 'color' | 'shape' | 'effect' | 'text' | 'palette';
  name: string;
  details: string;
  value?: string;
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedElements, setExtractedElements] = useState<ExtractedElement[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Simulate AI processing
        setTimeout(() => {
          setExtractedElements([
            { type: 'font', name: 'Helvetica Neue', details: '24px, Bold' },
            { type: 'color', name: 'Primary Blue', details: '#2563eb' },
            { type: 'shape', name: 'Logo Icon', details: 'Vector Graphic' },
            { type: 'effect', name: 'Drop Shadow', details: '8px blur, 25% opacity' },
            { 
              type: 'palette', 
              name: 'Color Palette', 
              details: 'Primary Colors',
              value: JSON.stringify([
                { color: '#2563eb', name: 'Primary Blue' },
                { color: '#1e40af', name: 'Dark Blue' },
                { color: '#60a5fa', name: 'Light Blue' },
                { color: '#f3f4f6', name: 'Background Gray' }
              ])
            },
            { type: 'text', name: 'Heading', details: 'Image Template Extractor' },
            { type: 'text', name: 'Button Text', details: 'Export Template' },
            { type: 'text', name: 'Upload Instructions', details: 'PNG, JPG up to 10MB' }
          ]);
          setIsProcessing(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderElementIcon = (type: string) => {
    switch (type) {
      case 'font':
        return <Type className="h-5 w-5 text-blue-600 mr-3" />;
      case 'color':
        return <Palette className="h-5 w-5 text-blue-600 mr-3" />;
      case 'shape':
        return <ImageIcon className="h-5 w-5 text-blue-600 mr-3" />;
      case 'effect':
        return <Settings2 className="h-5 w-5 text-blue-600 mr-3" />;
      case 'text':
        return <Text className="h-5 w-5 text-blue-600 mr-3" />;
      case 'palette':
        return <SwatchBook className="h-5 w-5 text-blue-600 mr-3" />;
      default:
        return <ImageIcon className="h-5 w-5 text-blue-600 mr-3" />;
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
              <span className="text-xs text-gray-500">{color.color}</span>
            </div>
          ))}
        </div>
      );
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Image Template Extractor</h1>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Template
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <div className={`border-2 border-dashed rounded-lg p-8 ${selectedImage ? 'border-gray-200' : 'border-blue-400'}`}>
              {!selectedImage ? (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Upload Image
                      <input id="file-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img src={selectedImage} alt="Uploaded" className="w-full rounded-lg" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <Settings2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Processing image...</p>
              </div>
            )}
          </div>

          {/* Right Column - Extracted Elements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Extracted Elements</h2>
            
            {extractedElements.length > 0 ? (
              <div className="space-y-4">
                {extractedElements.map((element, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    {renderElementIcon(element.type)}
                    <div className="flex-1">
                      <h3 className="font-medium">{element.name}</h3>
                      <p className="text-sm text-gray-500">{element.details}</p>
                      {element.type === 'palette' && element.value && renderPaletteColors(element.value)}
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Upload an image to see extracted elements</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
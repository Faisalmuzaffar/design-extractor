import { Download, Palette, Type, ImageIcon, Settings2, Text, SwatchBook } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { ExtractedElement } from "@/pages/home";

interface ElementDisplayProps {
  isProcessing: boolean;
  extractedElements: ExtractedElement[];
}

export function ElementDisplay({ isProcessing, extractedElements }: ElementDisplayProps) {
  const { toast } = useToast();

  const handleDownload = (element: ExtractedElement) => {
    try {
      let content = '';
      let filename = '';
      let type = '';

      switch (element.type) {
        case 'font':
          content = `/* Font Style */
font-family: ${element.details};`;
          filename = `${element.name.toLowerCase().replace(/\s+/g, '-')}.css`;
          type = 'text/css';
          break;

        case 'color':
          content = `/* Color Value */
color: ${element.details};
/* CSS Variable */
--${element.name.toLowerCase().replace(/\s+/g, '-')}: ${element.details};`;
          filename = `${element.name.toLowerCase().replace(/\s+/g, '-')}.css`;
          type = 'text/css';
          break;

        case 'shape':
          content = `/* Shape Properties */
${element.details}`;
          filename = `${element.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
          type = 'text/plain';
          break;

        case 'effect':
          content = `/* Effect Style */
box-shadow: ${element.details};`;
          filename = `${element.name.toLowerCase().replace(/\s+/g, '-')}.css`;
          type = 'text/css';
          break;

        case 'palette':
          if (element.value) {
            const colors = JSON.parse(element.value);
            content = colors.map((c: { color: string; name: string }) =>
              `--${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.color};`
            ).join('\n');
            filename = 'color-palette.css';
            type = 'text/css';
          }
          break;

        case 'text':
          content = element.details;
          filename = `${element.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
          type = 'text/plain';
          break;
      }

      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download successful",
        description: `${element.name} has been downloaded`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download the element"
      });
    }
  };

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
        <motion.div
          className="flex gap-2 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {colors.map((color: { color: string; name: string }, index: number) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
              <span className="text-xs text-gray-500 mt-1">{color.color}</span>
            </motion.div>
          ))}
        </motion.div>
      );
    } catch {
      return null;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Extracted Elements</h2>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[200px] flex items-center justify-center"
          >
            <div className="text-center">
              <LoadingSpinner />
              <motion.p
                className="mt-4 text-sm text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Analyzing image...
              </motion.p>
            </div>
          </motion.div>
        ) : extractedElements.length > 0 ? (
          <motion.div
            key="elements"
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {extractedElements.map((element, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
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
                  className="shrink-0 hover:scale-110 transition-transform"
                  title="Download"
                  onClick={() => handleDownload(element)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-[200px] flex items-center justify-center text-center text-gray-500"
          >
            <div>
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Upload an image to see extracted elements</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
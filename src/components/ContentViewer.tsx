
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentViewerProps {
  content: any;
  onQuizComplete: (contentId: string) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, onQuizComplete }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to handle xAPI messages from the iframe
  const handleXAPIMessage = (event: MessageEvent) => {
    // Check if the message is from our iframe and contains xAPI data
    if (event.source === iframeRef.current?.contentWindow && event.data?.xapi) {
      const xapiData = event.data.xapi;
      
      // Check if this is a quiz completion event
      if (xapiData.verb?.id === 'http://adlnet.gov/expapi/verbs/completed' ||
          xapiData.verb?.id === 'http://adlnet.gov/expapi/verbs/answered') {
        
        // If it's a completion event with a score or the last question
        if (xapiData.result?.completion === true || 
            (xapiData.result?.score && xapiData.context?.contextActivities?.grouping?.[0]?.id.includes('final'))) {
          
          // Notify the parent component that the quiz is completed
          onQuizComplete(content.$id);
          
          toast({
            title: "Quiz Completed",
            description: "Your responses have been recorded successfully",
          });
        }
      }
    }
  };

  useEffect(() => {
    // Add listener for xAPI messages
    window.addEventListener('message', handleXAPIMessage);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('message', handleXAPIMessage);
    };
  }, [content]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError("Failed to load the content. Please try again later.");
  };

  const getContentUrl = () => {
    if (!content) return '';
    
    // Construct the URL to the index.html file of the extracted content
    return `${import.meta.env.VITE_API_URL}/storage/buckets/${content.bucketId}/files/${content.fileId}/view?path=index.html`;
  };

  if (!content) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden border rounded-md">
      <div className="flex-1 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading content...</span>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 z-10">
            <div className="text-center p-6">
              <div className="text-destructive text-lg font-medium mb-2">Error</div>
              <p className="mb-4 text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reload
              </Button>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          src={getContentUrl()}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="w-full h-full border-0"
          title="xAPI Content"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      
      <div className="p-4 border-t flex justify-end bg-gray-50">
        <Button 
          variant="outline" 
          onClick={() => onQuizComplete(content.$id)}
          className="ml-auto"
        >
          Force Complete Quiz
        </Button>
      </div>
    </div>
  );
};

export default ContentViewer;

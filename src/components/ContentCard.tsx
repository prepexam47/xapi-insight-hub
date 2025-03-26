
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Eye, FileText, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { storage, BUCKET_ID } from '@/lib/appwrite';

interface ContentCardProps {
  id: string;
  name: string;
  fileId: string;
  uploadedAt: string;
  status: string;
  completionRate?: number;
  participantCount?: number;
  onView: (id: string) => void;
}

const ContentCard = ({
  id,
  name,
  fileId,
  uploadedAt,
  status,
  completionRate = 0,
  participantCount = 0,
  onView,
}: ContentCardProps) => {
  const [downloading, setDownloading] = useState(false);

  const formattedDate = new Date(uploadedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Function to download the content
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const fileUrl = storage.getFileDownload(BUCKET_ID, fileId);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = fileUrl.toString();
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-400';
      case 'active':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card className="content-card h-full flex flex-col animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="text-primary" size={20} />
            </div>
            <div>
              <CardTitle className="text-base font-medium line-clamp-1">{name}</CardTitle>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(id)}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Completion Rate</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-1.5" />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor()} mr-2`}></span>
              <span className="text-sm capitalize">{status}</span>
            </div>
            <span className="text-sm text-muted-foreground">{participantCount} participants</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download size={16} className="mr-1" />
          {downloading ? 'Downloading...' : 'Download'}
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => onView(id)}
        >
          <Eye size={16} className="mr-1" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;

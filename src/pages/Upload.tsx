
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, uploadContent } from '@/lib/appwrite';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, AlertCircle, CheckCircle, FileArchive, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Upload = () => {
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Simulated progress for better UX
  useEffect(() => {
    if (uploading && uploadProgress < 95) {
      const timer = setTimeout(() => {
        setUploadProgress((prev) => prev + 5);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [uploading, uploadProgress]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file is a zip
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
      setError('Please upload a valid ZIP file containing xAPI content');
      toast({
        variant: 'destructive',
        title: 'Invalid file format',
        description: 'Please upload a zip file containing xAPI content'
      });
      return;
    }
    
    setFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      await uploadContent(file);
      setUploadProgress(100);
      setUploadSuccess(true);
      
      toast({
        title: 'Upload successful',
        description: 'Your xAPI content has been uploaded',
      });
      
      // Reset after success
      setTimeout(() => {
        setFile(null);
        setUploading(false);
        setUploadProgress(0);
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed. Please try again.');
      setUploading(false);
      
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Please try again later',
      });
    }
  };

  const resetUpload = () => {
    setFile(null);
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 animate-fade-in">Upload xAPI Content</h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Upload your xAPI content package (ZIP file) to analyze learning data
      </p>

      {error && (
        <Alert variant="destructive" className="mb-6 animate-slide-up">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle>Upload Content Package</CardTitle>
          <CardDescription>
            Your xAPI content should be packaged as a ZIP file
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border'
              } transition-all duration-200 ease-in-out`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Drag and drop your file here</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    or <label htmlFor="file-upload" className="text-primary hover:underline cursor-pointer">browse</label> to choose a file
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports ZIP files containing xAPI content packages (max 100MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 border rounded-lg animate-scale-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileArchive className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                  </div>
                </div>
                {!uploading && (
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={resetUpload}
                    className="rounded-full h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {uploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {uploadSuccess ? 'Upload complete' : 'Uploading...'}
                    </span>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadSuccess ? 'Uploaded' : 'Uploading...'}
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Success
              </>
            ) : (
              'Upload Content'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-8 animate-scale-in">
        <CardHeader>
          <CardTitle>What happens after upload?</CardTitle>
          <CardDescription>
            Your content will be processed and made available for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Content Processing</h4>
                <p className="text-muted-foreground text-sm">
                  We'll extract and analyze the xAPI content from your package
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium">Data Preparation</h4>
                <p className="text-muted-foreground text-sm">
                  The system organizes the content structure and prepares it for tracking
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Ready for Use</h4>
                <p className="text-muted-foreground text-sm">
                  Your content will appear in your dashboard for tracking and analytics
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;

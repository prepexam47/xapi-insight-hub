import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getContentList } from '@/lib/appwrite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileArchive, Play, BarChart, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ContentViewer from '@/components/ContentViewer';

const Content = () => {
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState<Record<string, boolean>>({});
  
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
        fetchContent();
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const savedQuizStatus = localStorage.getItem('quizCompletionStatus');
    if (savedQuizStatus) {
      setQuizCompleted(JSON.parse(savedQuizStatus));
    }
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const contentList = await getContentList();
      
      const enhancedContent = contentList.map((item: any) => ({
        ...item,
        completionRate: Math.floor(Math.random() * 100),
        participantCount: Math.floor(Math.random() * 100) + 1,
      }));
      
      setContent(enhancedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load content. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchContent = (contentItem: any) => {
    setSelectedContent(contentItem);
    setContentDialogOpen(true);
  };

  const completeQuiz = (contentId: string) => {
    const updatedQuizStatus = { ...quizCompleted, [contentId]: true };
    setQuizCompleted(updatedQuizStatus);
    
    localStorage.setItem('quizCompletionStatus', JSON.stringify(updatedQuizStatus));
    
    toast({
      title: 'Quiz completed',
      description: 'Your responses have been recorded and reports are now available',
    });
    
    setContentDialogOpen(false);
  };

  const handleViewReports = (id: string) => {
    if (!quizCompleted[id]) {
      toast({
        variant: 'destructive',
        title: 'Report not available',
        description: 'You need to complete the quiz before viewing reports'
      });
      return;
    }
    
    navigate(`/reports?contentId=${id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Learning Content</h1>
        <p className="text-muted-foreground animate-fade-in">
          Browse and access your assigned learning content
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <Tabs defaultValue="all" className="animate-slide-up">
            <TabsList>
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              {content.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <FileArchive className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No content available</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      There is no learning content available for you at the moment.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.map((item) => (
                    <Card key={item.$id} className="overflow-hidden animate-scale-in">
                      <div className="h-3 bg-primary"></div>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>
                          Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1 text-sm">
                              <span>Progress</span>
                              <span>{item.completionRate}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${item.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                          {quizCompleted[item.$id] && (
                            <div className="mt-2 bg-green-50 text-green-700 rounded p-1.5 text-xs flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Quiz completed
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline"
                          onClick={() => handleViewReports(item.$id)}
                          disabled={!quizCompleted[item.$id]}
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          View Report
                          {!quizCompleted[item.$id] && (
                            <AlertCircle className="ml-2 h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button 
                          onClick={() => handleLaunchContent(item)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Launch
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="inProgress" className="pt-4">
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">Courses in progress will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completed" className="pt-4">
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">Completed courses will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <


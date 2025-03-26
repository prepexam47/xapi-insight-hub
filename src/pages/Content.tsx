
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getContentList } from '@/lib/appwrite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileArchive, Play, BarChart, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    // Load quiz completion status from localStorage
    const savedQuizStatus = localStorage.getItem('quizCompletionStatus');
    if (savedQuizStatus) {
      setQuizCompleted(JSON.parse(savedQuizStatus));
    }
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const contentList = await getContentList();
      
      // Add some demo data for visualization
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
    
    // Save to localStorage
    localStorage.setItem('quizCompletionStatus', JSON.stringify(updatedQuizStatus));
    
    toast({
      title: 'Quiz completed',
      description: 'Your responses have been recorded and reports are now available',
    });
    
    // Close the content dialog
    setContentDialogOpen(false);
  };

  const handleViewReports = (id: string) => {
    // Only allow viewing reports if quiz is completed
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

      {/* Content Viewer Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedContent?.name}</DialogTitle>
            <DialogDescription>
              Interactive learning content
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col overflow-hidden border rounded-md">
            {/* Content viewer would be here - this is a placeholder */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Module Introduction</h2>
                <p className="mb-4">This is where the actual content from the xAPI package would be displayed. The content would typically include text, images, videos, and interactive elements.</p>
                <p className="mb-4">Users would navigate through the content and eventually reach the quiz section where they would be tested on the material.</p>
              </div>
              
              {/* Sample Quiz */}
              <div className="border p-6 rounded-md bg-gray-50">
                <h3 className="text-xl font-bold mb-4">Quiz</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="font-medium">1. What is the primary purpose of xAPI?</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" id="q1a" name="q1" className="mr-2" />
                        <label htmlFor="q1a">To create visual presentations</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q1b" name="q1" className="mr-2" />
                        <label htmlFor="q1b">To track learning experiences</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q1c" name="q1" className="mr-2" />
                        <label htmlFor="q1c">To design user interfaces</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="font-medium">2. What does a statement in xAPI consist of?</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" id="q2a" name="q2" className="mr-2" />
                        <label htmlFor="q2a">Actor, verb, object</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q2b" name="q2" className="mr-2" />
                        <label htmlFor="q2b">Subject, predicate, object</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q2c" name="q2" className="mr-2" />
                        <label htmlFor="q2c">User, action, result</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end bg-gray-50">
              <Button onClick={() => completeQuiz(selectedContent?.$id)}>
                Submit Quiz & Generate Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Content;

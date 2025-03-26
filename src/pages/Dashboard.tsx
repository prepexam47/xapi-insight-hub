import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContentList, getCurrentUser } from '@/lib/appwrite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ContentCard from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { BarChart, Grid2X2, List, Loader2, Plus, Users, FileArchive } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

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
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (id: string) => {
    navigate(`/reports?contentId=${id}`);
  };

  const completionData = [
    { name: 'Module 1', completion: 78 },
    { name: 'Module 2', completion: 65 },
    { name: 'Module 3', completion: 83 },
    { name: 'Module 4', completion: 42 },
    { name: 'Module 5', completion: 56 },
  ];

  const quizData = [
    { name: 'Quiz 1', score: 82 },
    { name: 'Quiz 2', score: 75 },
    { name: 'Quiz 3', score: 91 },
    { name: 'Quiz 4', score: 68 },
  ];

  const totalContent = content.length;
  const avgCompletion = content.length > 0 
    ? Math.round(content.reduce((sum, item) => sum + item.completionRate, 0) / content.length) 
    : 0;
  const totalParticipants = content.reduce((sum, item) => sum + item.participantCount, 0);
  const activeContent = content.filter(item => item.status === 'active').length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 animate-fade-in">Dashboard</h1>
          <p className="text-muted-foreground animate-fade-in">
            Monitor your content performance and user engagement
          </p>
        </div>
        <div className="mt-4 md:mt-0 animate-fade-in">
          <Button onClick={() => navigate('/upload')}>
            <Plus size={16} className="mr-2" />
            Upload Content
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Content</CardDescription>
                <CardTitle className="text-3xl">{totalContent}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {activeContent} active packages
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg. Completion</CardDescription>
                <CardTitle className="text-3xl">{avgCompletion}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Across all content
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Participants</CardDescription>
                <CardTitle className="text-3xl">{totalParticipants}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  All-time participants
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Users</CardDescription>
                <CardTitle className="text-3xl">{Math.round(totalParticipants * 0.6)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Last 30 days
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="completion" className="animate-slide-up">
            <TabsList>
              <TabsTrigger value="completion">Completion Rates</TabsTrigger>
              <TabsTrigger value="quiz">Quiz Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="completion" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Content Completion Rates</CardTitle>
                  <CardDescription>
                    Average completion percentage for each content module
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={completionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Completion Rate']}
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #f0f0f0'
                          }}
                        />
                        <Bar 
                          dataKey="completion" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="quiz" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quiz Performance</CardTitle>
                  <CardDescription>
                    Average scores across different quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={quizData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Average Score']}
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #f0f0f0'
                          }}
                        />
                        <Bar 
                          dataKey="score" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Content</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('grid')}
                  className="h-8 w-8"
                >
                  <Grid2X2 size={16} />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('list')}
                  className="h-8 w-8"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {content.length === 0 ? (
              <div className="text-center py-12 content-card">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileArchive className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">No content yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first xAPI content package to get started
                </p>
                <Button onClick={() => navigate('/upload')}>
                  Upload Content
                </Button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.map((item) => (
                  <ContentCard
                    key={item.$id}
                    id={item.$id}
                    name={item.name}
                    fileId={item.fileId}
                    uploadedAt={item.uploadedAt}
                    status={item.status}
                    completionRate={item.completionRate}
                    participantCount={item.participantCount}
                    onView={handleViewContent}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {content.map((item) => (
                  <Card key={item.$id} className="animate-scale-in">
                    <div className="flex items-center p-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                        <FileArchive className="text-primary" size={20} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="text-right mr-4">
                          <div className="flex items-center">
                            <Users size={16} className="text-muted-foreground mr-1" />
                            <span className="text-sm">{item.participantCount}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">{item.completionRate}% completion</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleViewContent(item.$id)}
                        >
                          <BarChart size={16} className="mr-1" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUser, getXAPIStatements } from '@/lib/appwrite';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  ArrowLeft, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Loader2, 
  UserX 
} from 'lucide-react';

// Mock data for reports
const generateMockData = () => {
  // Quiz results data
  const quizResultsData = [
    { question: 'Question 1', correct: 68, incorrect: 32 },
    { question: 'Question 2', correct: 74, incorrect: 26 },
    { question: 'Question 3', correct: 42, incorrect: 58 },
    { question: 'Question 4', correct: 85, incorrect: 15 },
    { question: 'Question 5', correct: 63, incorrect: 37 },
  ];

  // Completion progress over time
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const completionTrendData = [
    { date: daysAgo(6), completion: 10 },
    { date: daysAgo(5), completion: 25 },
    { date: daysAgo(4), completion: 38 },
    { date: daysAgo(3), completion: 42 },
    { date: daysAgo(2), completion: 65 },
    { date: daysAgo(1), completion: 78 },
    { date: daysAgo(0), completion: 85 },
  ];

  // Time spent by section
  const timeSpentData = [
    { name: 'Introduction', value: 12 },
    { name: 'Module 1', value: 25 },
    { name: 'Module 2', value: 18 },
    { name: 'Module 3', value: 30 },
    { name: 'Assessment', value: 15 }
  ];

  // User engagement data
  const engagementData = [
    { date: daysAgo(6), active: 15, passive: 5 },
    { date: daysAgo(5), active: 18, passive: 8 },
    { date: daysAgo(4), active: 22, passive: 10 },
    { date: daysAgo(3), active: 28, passive: 12 },
    { date: daysAgo(2), active: 32, passive: 14 },
    { date: daysAgo(1), active: 38, passive: 15 },
    { date: daysAgo(0), active: 42, passive: 12 },
  ];

  return {
    quizResultsData,
    completionTrendData,
    timeSpentData,
    engagementData,
    contentTitle: 'Advanced Sales Training Module',
    participants: 85,
    avgScore: 72,
    avgCompletion: 78,
    avgTimeSpent: '45 minutes'
  };
};

const Reports = () => {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('contentId');
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
        fetchReportData();
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, contentId]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      if (contentId) {
        // In a real app, we would fetch statements related to this content
        await getXAPIStatements();
        
        // For now, we'll use mock data
        setTimeout(() => {
          setData(generateMockData());
          setLoading(false);
        }, 1000);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  const downloadReport = () => {
    // In a real app, we would generate a proper report
    alert('Report download functionality would be implemented here');
  };

  // Colors for charts
  const COLORS = ['#3b82f6', '#93c5fd', '#60a5fa', '#2563eb', '#1d4ed8'];
  const CORRECT_COLOR = '#16a34a';
  const INCORRECT_COLOR = '#ef4444';
  const ACTIVE_COLOR = '#3b82f6';
  const PASSIVE_COLOR = '#94a3b8';

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mb-2 -ml-2 text-muted-foreground"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2 animate-fade-in">Content Report</h1>
          {!loading && data && (
            <p className="text-muted-foreground animate-fade-in">
              Analytics for {data.contentTitle}
            </p>
          )}
        </div>
        {!loading && data && (
          <Button onClick={downloadReport} className="mt-4 md:mt-0 animate-fade-in">
            <Download size={16} className="mr-2" />
            Download Report
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !data ? (
        <Card className="animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserX size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No data available</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              There is no report data available for this content. This might be because no users have interacted with it yet.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Participants</CardDescription>
                <CardTitle className="text-3xl">{data.participants}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Total users
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Score</CardDescription>
                <CardTitle className="text-3xl">{data.avgScore}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Across all quizzes
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completion Rate</CardDescription>
                <CardTitle className="text-3xl">{data.avgCompletion}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Average completion
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Time</CardDescription>
                <CardTitle className="text-3xl">{data.avgTimeSpent}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Time spent per user
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Reports */}
          <Tabs defaultValue="quiz" className="animate-slide-up">
            <TabsList className="mb-4">
              <TabsTrigger value="quiz">Quiz Results</TabsTrigger>
              <TabsTrigger value="completion">Completion Trends</TabsTrigger>
              <TabsTrigger value="time">Time Analysis</TabsTrigger>
              <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            </TabsList>
            
            {/* Quiz Results Tab */}
            <TabsContent value="quiz" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quiz Performance Analysis</CardTitle>
                  <CardDescription>
                    Correct vs. incorrect answers for each quiz question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.quizResultsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        barGap={0}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="question" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #f0f0f0'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="correct" name="Correct" fill={CORRECT_COLOR} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="incorrect" name="Incorrect" fill={INCORRECT_COLOR} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Completion Trends Tab */}
            <TabsContent value="completion" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Completion Trend</CardTitle>
                  <CardDescription>
                    Average completion rate over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={data.completionTrendData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Completion']}
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #f0f0f0'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="completion" 
                          stroke="#3b82f6" 
                          fill="url(#colorCompletion)" 
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Time Analysis Tab */}
            <TabsContent value="time" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Time Spent by Module</CardTitle>
                  <CardDescription>
                    Distribution of time spent across different parts of the content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data.timeSpentData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {data.timeSpentData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} minutes`, 'Time Spent']}
                            contentStyle={{ 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: '1px solid #f0f0f0'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* User Engagement Tab */}
            <TabsContent value="engagement" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">User Engagement</CardTitle>
                  <CardDescription>
                    Active vs. passive engagement over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={data.engagementData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        stackOffset="none"
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value}`} />
                        <Tooltip
                          formatter={(value) => [`${value} users`, '']}
                          contentStyle={{ 
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #f0f0f0'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="active" 
                          name="Active Engagement" 
                          stackId="1"
                          stroke={ACTIVE_COLOR} 
                          fill={ACTIVE_COLOR} 
                          fillOpacity={0.5}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="passive" 
                          name="Passive Viewing" 
                          stackId="1"
                          stroke={PASSIVE_COLOR} 
                          fill={PASSIVE_COLOR} 
                          fillOpacity={0.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* User Progress Section */}
          <Card className="animate-slide-up">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl">Individual User Progress</CardTitle>
                  <CardDescription>
                    Detailed completion statistics for individual users
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <Button variant="outline" size="icon">
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm">Page 1 of 4</span>
                  <Button variant="outline" size="icon">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Completion</th>
                      <th className="text-left py-3 px-4 font-medium">Quiz Score</th>
                      <th className="text-left py-3 px-4 font-medium">Time Spent</th>
                      <th className="text-left py-3 px-4 font-medium">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="text-xs font-medium">{String.fromCharCode(65 + index)}</span>
                            </div>
                            <span>User {index + 1}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-full bg-secondary rounded-full h-2 mr-2 max-w-24">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${Math.round(70 + Math.random() * 30)}%` }}
                              ></div>
                            </div>
                            <span>{Math.round(70 + Math.random() * 30)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{Math.round(60 + Math.random() * 40)}%</td>
                        <td className="py-3 px-4">{Math.round(30 + Math.random() * 30)} min</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(Date.now() - Math.round(Math.random() * 86400000 * 3)).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;

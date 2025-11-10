'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  MessageSquare,
  BarChart3,
  Calendar
} from 'lucide-react';
import { isAuthenticated } from '@/lib/api';

interface UserData {
  username: string;
  name: string;
  email: string;
  role: string;
  loginTime: string;
}

interface DashboardStats {
  totalMembers: number;
  totalPosts: number;
  engagement: number;
  messages: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock dashboard stats
  const [stats] = useState<DashboardStats>({
    totalMembers: 1247,
    totalPosts: 89,
    engagement: 76,
    messages: 23
  });

  // Mock recent activities
  const recentActivities = [
    { id: 1, action: 'New member joined', user: 'Ram Kumar', time: '5 minutes ago' },
    { id: 2, action: 'Post published', user: 'Sita Sharma', time: '15 minutes ago' },
    { id: 3, action: 'Event created', user: 'Hari Prasad', time: '1 hour ago' },
    { id: 4, action: 'Message received', user: 'Gita Devi', time: '2 hours ago' },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Get user data from localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserData(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-mm-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-mm-ink font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-mm-ink mb-2">
          Welcome back, {userData.name}!
        </h1>
        <p className="text-muted-foreground">
          Here''s your daily activity summary
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-mm-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
            <Users className="w-5 h-5 text-mm-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mm-ink">{stats.totalMembers.toLocaleString()}</div>
            <p className="text-xs text-mm-primary mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-mm-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
            <FileText className="w-5 h-5 text-mm-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mm-ink">{stats.totalPosts}</div>
            <p className="text-xs text-mm-accent mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +5 this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-mm-warm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagement Rate
            </CardTitle>
            <BarChart3 className="w-5 h-5 text-mm-warm" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mm-ink">{stats.engagement}%</div>
            <p className="text-xs text-mm-warm mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Messages
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mm-ink">{stats.messages}</div>
            <p className="text-xs text-blue-500 mt-1">
              Awaiting response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activity from the past hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-mm-bg/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-mm-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-mm-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-mm-ink">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Users className="w-4 h-4 mr-3" />
              <span>Add New Member</span>
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <FileText className="w-4 h-4 mr-3" />
              <span>Create Post</span>
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Calendar className="w-4 h-4 mr-3" />
              <span>Schedule Event</span>
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <MessageSquare className="w-4 h-4 mr-3" />
              <span>Send Message</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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

  // Recent activities mock data
  const recentActivities = [
    { id: 1, action: 'New member joined', user: 'Ram Kumar', time: '5 minutes ago' },
    { id: 2, action: 'Post published', user: 'Sita Devi', time: '15 minutes ago' },
    { id: 3, action: 'Comment added', user: 'Hari Bahadur', time: '30 minutes ago' },
    { id: 4, action: 'Event created', user: 'Geeta Sharma', time: '1 hour ago' },
  ];

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.replace('/login');
        return;
      }

      const storedUserData = localStorage.getItem('mm_user_data');
      if (!storedUserData) {
        router.replace('/login');
        return;
      }

      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

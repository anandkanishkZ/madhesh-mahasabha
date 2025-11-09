'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { login, setAuthToken, isAuthenticated } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in
    const checkAuth = () => {
      if (isAuthenticated()) {
        router.replace('/dashboard');
      } else {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mm-bg via-white to-mm-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-mm-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-mm-ink font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await login({ username, password });

      if (response.success && response.data) {
        // Store JWT token
        setAuthToken(response.data.token);

        // Store user data
        const userData = {
          id: response.data.admin.id,
          username: response.data.admin.username,
          name: response.data.admin.name,
          email: response.data.admin.email,
          role: response.data.admin.role,
          isActive: response.data.admin.isActive,
          lastLogin: response.data.admin.lastLogin,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('mm_user_data', JSON.stringify(userData));

        // Redirect to dashboard - use replace to prevent back button issues
        router.replace('/dashboard');
      } else {
        setError(response.error || 'Login failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mm-bg via-white to-mm-primary/5 p-4">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-2">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-mm-primary to-mm-accent rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-mm-primary">
            Admin Dashboard
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Sign in to continue
          </p>
          
          {/* Development credentials helper */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-left text-xs">
              <p className="font-semibold text-blue-900 mb-1">Default Credentials:</p>
              <p className="text-blue-700">Username: <span className="font-mono font-bold">admin</span> <span className="text-blue-500">or</span> <span className="font-mono font-bold">admin@madheshmahasabha.com</span></p>
              <p className="text-blue-700">Password: <span className="font-mono font-bold">Admin@123456</span></p>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-mm-ink">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="admin or admin@madheshmahasabha.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-mm-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-mm-ink">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-2 focus:border-mm-primary"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-mm-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="mt-6 p-4 bg-mm-bg/50 rounded-lg border border-mm-primary/20">
              <p className="text-xs text-muted-foreground text-center mb-2 font-semibold">
                Admin Credentials:
              </p>
              <div className="text-xs space-y-1 font-mono">
                <p className="text-center"><strong>Username:</strong> admin</p>
                <p className="text-center"><strong>Password:</strong> Admin@123456</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials (in real app, this would be validated against backend)
  const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'madhesh123'
  };

  useEffect(() => {
    // Check if already logged in
    const authToken = localStorage.getItem('mm_auth_token');
    if (authToken) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      // Create auth token and user data
      const authToken = btoa(`${username}:${Date.now()}`);
      const userData = {
        username,
        name: 'Administrator',
        email: 'admin@madheshmahasabha.com',
        role: 'System Administrator',
        loginTime: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem('mm_auth_token', authToken);
      localStorage.setItem('mm_user_data', JSON.stringify(userData));

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setError('Invalid username or password. Please try again.');
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
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
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
                Demo Credentials:
              </p>
              <div className="text-xs space-y-1 font-mono">
                <p className="text-center"><strong>Username:</strong> admin</p>
                <p className="text-center"><strong>Password:</strong> madhesh123</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

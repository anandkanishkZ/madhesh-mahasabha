'use client';

import { useEffect, useState } from 'react';
import { LinkButton } from './ui/LinkButton';
import { LogIn, LayoutDashboard } from 'lucide-react';

export function DashboardAccess() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('mm_auth_token');
    setIsLoggedIn(!!authToken);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isLoggedIn ? (
        <LinkButton
          href="/dashboard"
          variant="primary"
          size="lg"
          className="shadow-2xl hover:shadow-mm-primary/50 flex items-center gap-2"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </LinkButton>
      ) : (
        <LinkButton
          href="/login"
          variant="outline"
          size="lg"
          className="shadow-2xl hover:shadow-mm-primary/30 flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </LinkButton>
      )}
    </div>
  );
}

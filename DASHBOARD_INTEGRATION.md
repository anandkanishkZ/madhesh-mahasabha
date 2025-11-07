# Optional: Adding Dashboard Access to Main Site

If you want to add a floating dashboard access button to the main site pages, follow these steps:

## Option 1: Add to Specific Pages

### Example: Add to Home Page

Edit `app/page.tsx`:

```tsx
import { Hero } from '@/components/Hero';
import { DashboardAccess } from '@/components/DashboardAccess'; // Add this import
// ... other imports

export default function Home() {
  return (
    <>
      {/* Your existing code */}
      <main id="main-content">
        <Hero />
        {/* ... rest of your page */}
      </main>
      
      {/* Add this before closing tag */}
      <DashboardAccess />
    </>
  );
}
```

## Option 2: Add to All Site Pages (Recommended)

### Edit the Site Layout

Edit `app/(site)/layout.tsx` (create if it doesn't exist):

```tsx
import { DashboardAccess } from '@/components/DashboardAccess';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <DashboardAccess />
    </>
  );
}
```

## Option 3: Add to Header Component

Edit `components/Header.tsx`:

Add import:
```tsx
import { DashboardAccess } from './DashboardAccess';
```

Add component at the end of Header component return statement.

## Customization Options

### Change Position

Edit `components/DashboardAccess.tsx`:

```tsx
// Bottom Right (default)
<div className="fixed bottom-6 right-6 z-50">

// Bottom Left
<div className="fixed bottom-6 left-6 z-50">

// Top Right
<div className="fixed top-6 right-6 z-50">

// Top Left
<div className="fixed top-6 left-6 z-50">
```

### Change Appearance

```tsx
// Smaller size
<LinkButton size="sm" ...>

// Different variant
<LinkButton variant="accent" ...>

// Add tooltip
<div className="group relative">
  <LinkButton ...>
  <span className="absolute bottom-full mb-2 hidden group-hover:block 
    bg-black text-white text-xs rounded px-2 py-1">
    Dashboard
  </span>
</div>
```

### Hide on Mobile

```tsx
<div className="hidden md:block fixed bottom-6 right-6 z-50">
```

### Hide on Dashboard/Login Pages

The component could be enhanced to check current path:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
// ... other imports

export function DashboardAccess() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('mm_auth_token');
    setIsLoggedIn(!!authToken);
  }, []);

  // Hide on dashboard and login pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    // ... rest of component
  );
}
```

## Testing

After adding the component:

1. Visit home page: `http://localhost:3000`
2. You should see floating button in bottom-right
3. If logged out: Shows "लगइन" (Login) button
4. If logged in: Shows "ड्यासबोर्ड" (Dashboard) button
5. Click to navigate to respective page

## Removing the Component

Simply remove or comment out the `<DashboardAccess />` line from where you added it.

---

**Note**: The `DashboardAccess` component is completely optional and not required for the dashboard to function. It's just a convenience feature for easy navigation.

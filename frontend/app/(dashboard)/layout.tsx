import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard | Madhesh Mahasabha',
    template: '%s | Dashboard'
  },
  description: 'Madhesh Mahasabha Admin Dashboard - Manage members, posts, events and more',
  robots: {
    index: false,
    follow: false
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

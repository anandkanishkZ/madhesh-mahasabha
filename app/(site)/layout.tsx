import { Header } from '@/components/Header';
import { BackToTop } from '@/components/BackToTop';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen w-full overflow-x-hidden page-enter">
        {children}
      </div>
      <BackToTop />
    </>
  );
}

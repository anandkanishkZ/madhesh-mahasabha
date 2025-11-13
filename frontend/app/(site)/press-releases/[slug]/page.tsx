import { Footer } from '@/components/Footer';
import { Newsletter } from '@/components/Newsletter';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { 
  Calendar, 
  ArrowLeft,
  Download,
  FileText,
  Mail,
  Phone,
  Eye,
  Clock,
  ChevronRight,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { PressReleaseShare, PressReleaseShareSection } from '@/components/PressReleaseShare';
import { getPressReleases, getPressReleaseBySlug, type PressRelease } from '@/lib/api';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ne-NP', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getCategoryInfo = (category: string) => {
  const categories: { [key: string]: { labelNp: string, color: string } } = {
    'announcement': { labelNp: 'घोषणा', color: 'bg-blue-500' },
    'statement': { labelNp: 'वक्तव्य', color: 'bg-purple-500' },
    'event': { labelNp: 'कार्यक्रम', color: 'bg-green-500' },
    'achievement': { labelNp: 'उपलब्धि', color: 'bg-orange-500' },
  };
  return categories[category] || { labelNp: category, color: 'bg-gray-500' };
};

// Fetch press release from API
async function getPressRelease(slug: string): Promise<PressRelease | null> {
  try {
    const response = await getPressReleaseBySlug(slug);
    
    if (!response.success || !response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching press release:', error);
    return null;
  }
}

// Generate static params for all press releases
export async function generateStaticParams() {
  try {
    // Fetch all published press releases from API
    const response = await getPressReleases({ limit: 100 });
    
    if (!response.success || !response.data?.pressReleases) {
      return [];
    }

    return response.data.pressReleases.map((release: PressRelease) => ({
      slug: release.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const release = await getPressRelease(slug);
  
  if (!release) {
    return generateSEOMetadata({
      title: 'प्रेस विज्ञप्ति फेला परेन',
      description: 'यो प्रेस विज्ञप्ति उपलब्ध छैन।',
      path: '/press-releases',
    });
  }

  return generateSEOMetadata({
    title: release.titleNp,
    description: release.excerptNp || release.titleNp,
    path: `/press-releases/${release.slug}`,
    image: release.imageUrl,
  });
}

export default async function PressReleasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = await getPressRelease(slug);

  if (!release) {
    notFound();
  }

  const catInfo = getCategoryInfo(release.category);

  // Calculate reading time (average 200 words per minute for Nepali)
  const getReadingTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const readingTime = getReadingTime(release.contentNp);

  return (
    <>
      <main id="main-content" className="min-h-screen bg-gray-50">
        {/* Hero Section with Breadcrumb and Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="py-8 sm:py-12 px-4 sm:px-[4%] md:px-[7%]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 max-w-4xl mx-auto" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-mm-primary transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span className="nepali-text">गृह</span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/press-releases" className="hover:text-mm-primary transition-colors nepali-text">
                प्रेस विज्ञप्ति
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 font-medium truncate nepali-text">
                {release.titleNp}
              </span>
            </nav>

            {/* Back Button */}
            <div className="max-w-4xl mx-auto mb-6">
              <Link
                href="/press-releases"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-mm-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium nepali-text">सबै विज्ञप्तिहरूमा फर्कनुहोस्</span>
              </Link>
            </div>

            {/* Header */}
            <header className="max-w-4xl mx-auto">
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="nepali-text text-sm" style={{ backgroundColor: catInfo.color }}>
                  {catInfo.labelNp}
                </Badge>
                {release.priority === 'urgent' && (
                  <Badge variant="destructive" className="nepali-text text-sm">
                    अति जरुरी
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "'Ek Mukta', 'Mukta', sans-serif" }}
              >
                {release.titleNp}
              </h1>
              
              {/* Meta Information and Share */}
              <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 text-gray-600 text-sm">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-mm-primary" />
                    <span className="nepali-text">{formatDate(release.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="nepali-text">{readingTime} मिनेट पढाइ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>{release.viewCount} views</span>
                  </div>
              </div>
              
              {/* Share Buttons */}
              <PressReleaseShare 
                title={release.titleNp}
                excerpt={release.excerptNp || release.titleNp}
              />
            </div>
          </header>
        </div>
      </div>        {/* Main Content */}
        <div className="py-8 sm:py-12 px-4 sm:px-[4%] md:px-[7%]">
          <article className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {release.imageUrl && (
              <div className="mb-8 sm:mb-12">
                <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={release.imageUrl}
                    alt={release.titleNp}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12 mb-8">
              <div 
                className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-mm-primary prose-a:no-underline hover:prose-a:underline"
                style={{ fontFamily: "'Ek Mukta', 'Mukta', sans-serif" }}
              >
                <div 
                  className="text-gray-700 leading-relaxed space-y-6"
                  style={{ 
                    fontSize: '1.125rem',
                    lineHeight: '1.8',
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: release.contentNp
                      .split('\n\n')
                      .map(para => `<p class="mb-6">${para.replace(/\n/g, '<br/>')}</p>`)
                      .join('') 
                  }}
                />
              </div>
            </div>

            {/* Tags */}
            {release.tags && release.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 nepali-text" style={{ fontFamily: "'Ek Mukta', 'Mukta', sans-serif" }}>
                  ट्यागहरू
                </h3>
                <div className="flex flex-wrap gap-2">
                  {release.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-mm-primary/10 to-mm-primary/20 text-mm-primary text-sm font-medium rounded-full border border-mm-primary/30 hover:from-mm-primary/20 hover:to-mm-primary/30 transition-colors nepali-text"
                      style={{ fontFamily: "'Ek Mukta', 'Mukta', sans-serif" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Share Section */}
            <PressReleaseShareSection 
              title={release.titleNp}
              excerpt={release.excerptNp || release.titleNp}
            />

            {/* Contact Information */}
            {(release.contactEmail || release.contactPhone) && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-6 nepali-text"
                  style={{ fontFamily: "'Ek Mukta', 'Mukta', sans-serif" }}
                >
                  सम्पर्क जानकारी
                </h3>
                <div className="space-y-4">
                  {release.contactEmail && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-mm-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-mm-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 nepali-text">इमेल</div>
                        <a
                          href={`mailto:${release.contactEmail}`}
                          className="text-mm-primary font-semibold hover:underline"
                        >
                          {release.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {release.contactPhone && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-mm-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-mm-accent" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 nepali-text">फोन</div>
                        <a
                          href={`tel:${release.contactPhone}`}
                          className="text-mm-primary font-semibold hover:underline"
                        >
                          {release.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attachments */}
            {release.attachments && release.attachments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-6 nepali-text"
                  style={{ fontFamily: "'Ek Mukta', 'Mukta', sans-serif" }}
                >
                  संलग्नकहरू
                </h3>
                <div className="grid gap-4">
                  {release.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-mm-primary hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-mm-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-7 h-7 text-mm-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-mm-primary transition-colors">
                            Document {index + 1}
                          </div>
                          <div className="text-sm text-gray-500">PDF / Document</div>
                        </div>
                      </div>
                      <Download className="w-6 h-6 text-gray-400 group-hover:text-mm-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Update Information */}
            {release.updatedAt !== release.publishedAt && (
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-blue-800">
                  <Clock className="w-4 h-4" />
                  <span className="nepali-text">
                    अन्तिम अद्यावधिक: {formatDate(release.updatedAt)}
                  </span>
                </div>
              </div>
            )}
          </article>
        </div>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

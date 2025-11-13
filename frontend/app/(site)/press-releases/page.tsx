import { Footer } from '@/components/Footer';
import { Newsletter } from '@/components/Newsletter';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { 
  Calendar, 
  Tag, 
  ArrowRight, 
  FileText,
  BookOpen,
  Megaphone,
  Mail,
  Download,
  TrendingUp,
  Clock,
  Sparkles,
  AlertCircle,
  Bell,
  Award,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getPressReleases, type PressRelease } from '@/lib/api';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = generateMetadata({
  title: 'प्रेस विज्ञप्ति',
  description: 'मधेश महासभाका आधिकारिक प्रेस विज्ञप्ति, घोषणा र वक्तव्यहरू।',
  path: '/press-releases',
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ne-NP', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const getCategoryInfo = (category: string) => {
  const categories: { [key: string]: { label: string, labelNp: string, color: string, icon: any } } = {
    'announcement': { 
      label: 'Announcement', 
      labelNp: 'घोषणा', 
      color: 'bg-blue-500', 
      icon: Bell 
    },
    'statement': { 
      label: 'Statement', 
      labelNp: 'वक्तव्य', 
      color: 'bg-purple-500', 
      icon: MessageSquare 
    },
    'event': { 
      label: 'Event', 
      labelNp: 'कार्यक्रम', 
      color: 'bg-green-500', 
      icon: Calendar 
    },
    'achievement': { 
      label: 'Achievement', 
      labelNp: 'उपलब्धि', 
      color: 'bg-orange-500', 
      icon: Award 
    },
  };
  return categories[category] || { label: category, labelNp: category, color: 'bg-gray-500', icon: FileText };
};

const getPriorityBadge = (priority: string) => {
  const priorities: { [key: string]: { label: string, labelNp: string, variant: 'default' | 'destructive' | 'outline' | 'secondary' } } = {
    'urgent': { label: 'Urgent', labelNp: 'अति जरुरी', variant: 'destructive' },
    'high': { label: 'High', labelNp: 'उच्च', variant: 'default' },
    'normal': { label: 'Normal', labelNp: 'सामान्य', variant: 'secondary' },
    'low': { label: 'Low', labelNp: 'कम', variant: 'outline' },
  };
  return priorities[priority] || priorities['normal'];
};

// Fetch press releases from API
async function fetchPressReleases(): Promise<PressRelease[]> {
  try {
    const response = await getPressReleases({ limit: 50 });
    
    if (!response.success || !response.data?.pressReleases) {
      console.error('Failed to fetch press releases:', response.error);
      return [];
    }

    return response.data.pressReleases;
  } catch (error) {
    console.error('Error fetching press releases:', error);
    return [];
  }
}

export default async function PressReleases() {
  const pressReleases = await fetchPressReleases();
  const featuredRelease = pressReleases.length > 0 ? pressReleases[0] : null;
  const otherReleases = pressReleases.length > 1 ? pressReleases.slice(1) : [];
  const allCategories = Array.from(new Set(pressReleases.map(pr => pr.category)));

  return (
    <>
      <main id="main-content" className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-mm-primary/10 via-mm-accent/5 to-white">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] bg-mm-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] bg-mm-accent/10 rounded-full blur-3xl"></div>
          
          <div className="container-custom relative z-10 py-20">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                  <Megaphone className="w-4 h-4 text-mm-primary" />
                  <span className="nepali-heading text-sm font-semibold text-mm-primary">
                    आधिकारिक जानकारी
                  </span>
                </div>
              </div>
              
              <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
                प्रेस विज्ञप्ति
              </h1>
              
              <p className="nepali-text text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
                मधेश महासभाका आधिकारिक प्रेस विज्ञप्ति, घोषणा र वक्तव्यहरूको संग्रह
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-mm-ink">{pressReleases.length}</div>
                    <div className="nepali-text text-sm text-gray-600">कुल विज्ञप्ति</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-accent rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-mm-ink">{allCategories.length}</div>
                    <div className="nepali-text text-sm text-gray-600">श्रेणीहरू</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white border-b">
          <div className="container-custom">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-mm-primary text-white rounded-lg nepali-text font-medium hover:bg-mm-primary/90 transition-colors">
                सबै
              </button>
              {['announcement', 'statement', 'event', 'achievement'].map((cat) => {
                const catInfo = getCategoryInfo(cat);
                const Icon = catInfo.icon;
                return (
                  <button
                    key={cat}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg nepali-text font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {catInfo.labelNp}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Press Release */}
        {featuredRelease && (
          <section className="py-16 bg-white">
            <div className="container-custom">
              <div className="mb-8">
                <h2 className="nepali-heading text-3xl font-bold text-mm-ink flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-mm-primary" />
                  नवीनतम विज्ञप्ति
                </h2>
              </div>

              <div className="bg-gradient-to-br from-mm-primary/5 to-white rounded-2xl overflow-hidden border-2 border-mm-primary/20 hover:border-mm-primary/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="grid lg:grid-cols-2 gap-8 p-8">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      {featuredRelease.priority && getPriorityBadge(featuredRelease.priority).variant === 'destructive' && (
                        <Badge variant="destructive" className="nepali-text">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {getPriorityBadge(featuredRelease.priority).labelNp}
                        </Badge>
                      )}
                      <Badge className="nepali-text" style={{ backgroundColor: getCategoryInfo(featuredRelease.category).color }}>
                        {getCategoryInfo(featuredRelease.category).labelNp}
                      </Badge>
                    </div>

                    <h3 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink leading-tight">
                      {featuredRelease.titleNp}
                    </h3>

                    <p className="nepali-text text-lg text-gray-600 leading-relaxed">
                      {featuredRelease.excerptNp}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="nepali-text">{formatDate(featuredRelease.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>{featuredRelease.viewCount} views</span>
                      </div>
                    </div>

                    {featuredRelease.tags && featuredRelease.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {featuredRelease.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm nepali-text text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/press-releases/${featuredRelease.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-mm-primary text-white rounded-lg font-semibold hover:bg-mm-primary/90 transition-all transform hover:scale-105 hover:shadow-lg group"
                    >
                      <span className="nepali-text">पूर्ण विवरण पढ्नुहोस्</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {featuredRelease.imageUrl && (
                    <div className="relative h-96 rounded-xl overflow-hidden">
                      <img
                        src={featuredRelease.imageUrl}
                        alt={featuredRelease.titleNp}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Press Releases */}
        {otherReleases.length > 0 && (
          <section className="py-16">
            <div className="container-custom">
              <div className="mb-8">
                <h2 className="nepali-heading text-3xl font-bold text-mm-ink">
                  अन्य विज्ञप्तिहरू
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherReleases.map((release) => {
                  const catInfo = getCategoryInfo(release.category);
                  const CategoryIcon = catInfo.icon;
                  const priorityInfo = release.priority ? getPriorityBadge(release.priority) : null;

                  return (
                    <article
                      key={release.slug}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-mm-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg group"
                    >
                      {release.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={release.imageUrl}
                            alt={release.titleNp}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className="nepali-text text-xs" style={{ backgroundColor: catInfo.color }}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {catInfo.labelNp}
                          </Badge>
                          {priorityInfo && priorityInfo.variant === 'destructive' && (
                            <Badge variant={priorityInfo.variant} className="nepali-text text-xs">
                              {priorityInfo.labelNp}
                            </Badge>
                          )}
                        </div>

                        <h3 className="nepali-heading text-xl font-bold text-mm-ink group-hover:text-mm-primary transition-colors leading-tight line-clamp-2">
                          {release.titleNp}
                        </h3>

                        <p className="nepali-text text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {release.excerptNp}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="nepali-text">{formatDate(release.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{release.viewCount}</span>
                          </div>
                        </div>

                        <Link
                          href={`/press-releases/${release.slug}`}
                          className="inline-flex items-center gap-2 text-mm-primary font-semibold hover:gap-3 transition-all group/link"
                        >
                          <span className="nepali-text">पढ्नुहोस्</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* No Press Releases */}
        {pressReleases.length === 0 && (
          <section className="py-20">
            <div className="container-custom text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="nepali-heading text-2xl font-bold text-gray-700 mb-4">
                  कुनै प्रेस विज्ञप्ति उपलब्ध छैन
                </h3>
                <p className="nepali-text text-gray-500">
                  नयाँ प्रेस विज्ञप्तिहरू चाँडै प्रकाशित गरिनेछ।
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-mm-primary to-mm-accent">
          <div className="container-custom text-center">
            <div className="max-w-3xl mx-auto">
              <Mail className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="nepali-heading text-3xl md:text-4xl font-bold text-white mb-4">
                प्रेस विज्ञप्ति प्राप्त गर्नुहोस्
              </h2>
              <p className="nepali-text text-xl text-white/90 mb-8">
                हाम्रा नवीनतम प्रेस विज्ञप्ति र घोषणाहरू सीधा आफ्नो इमेलमा पाउनुहोस्
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-mm-primary rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                <span className="nepali-text">सम्पर्क गर्नुहोस्</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

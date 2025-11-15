import { Footer } from '@/components/Footer';
import { Newsletter } from '@/components/Newsletter';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { 
  Calendar, 
  ArrowRight, 
  FileText,
  BookOpen,
  Mail,
  Phone,
  TrendingUp,
  Clock,
  Sparkles,
  AlertCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getPressReleases, type PressRelease } from '@/lib/api';
import AuthenticatedImage from '@/components/AuthenticatedImage';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = generateMetadata({
  title: 'प्रेस विज्ञप्तिहरू',
  description: 'मधेश महासभाका आधिकारिक प्रेस विज्ञप्ति, वक्तव्य र घोषणाहरू पढ्नुहोस्।',
  path: '/press-releases',
});

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
  const categories: { [key: string]: { labelNp: string, color: string, icon: any } } = {
    'announcement': { labelNp: 'घोषणा', color: 'bg-blue-500', icon: AlertCircle },
    'statement': { labelNp: 'वक्तव्य', color: 'bg-purple-500', icon: FileText },
    'event': { labelNp: 'कार्यक्रम', color: 'bg-green-500', icon: Calendar },
    'achievement': { labelNp: 'उपलब्धि', color: 'bg-orange-500', icon: TrendingUp },
  };
  return categories[category] || { labelNp: category, color: 'bg-gray-500', icon: FileText };
};

const getPriorityInfo = (priority: string) => {
  const priorities: { [key: string]: { labelNp: string, color: string } } = {
    'urgent': { labelNp: 'अत्यावश्यक', color: 'bg-red-500' },
    'high': { labelNp: 'उच्च', color: 'bg-orange-500' },
    'normal': { labelNp: 'सामान्य', color: 'bg-blue-500' },
    'low': { labelNp: 'कम', color: 'bg-gray-500' },
  };
  return priorities[priority] || { labelNp: priority, color: 'bg-gray-500' };
};

async function fetchPressReleases() {
  try {
    const response = await getPressReleases({ limit: 50 });
    
    if (!response.success || !response.data?.pressReleases) {
      return [];
    }

    return response.data.pressReleases;
  } catch (error) {
    console.error('Error fetching press releases:', error);
    return [];
  }
}

export default async function PressReleasesPage() {
  const pressReleases = await fetchPressReleases();
  const featuredRelease = pressReleases.length > 0 ? pressReleases[0] : null;
  const otherReleases = pressReleases.length > 1 ? pressReleases.slice(1) : [];
  
  // Get unique categories
  const allCategories = Array.from(new Set(pressReleases.map(pr => pr.category)));
  
  // Get category counts
  const categoryCounts = pressReleases.reduce((acc, pr) => {
    acc[pr.category] = (acc[pr.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <>
      <main id="main-content" className="bg-gray-50">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-mm-primary/5">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] bg-mm-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] bg-mm-accent/5 rounded-full blur-3xl"></div>
          
          <div className="container-custom relative z-10 py-20">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                  <FileText className="w-4 h-4 text-mm-primary" />
                  <span className="nepali-heading text-sm font-semibold text-mm-primary">
                    आधिकारिक विज्ञप्ति
                  </span>
                </div>
              </div>
              
              <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
                प्रेस विज्ञप्तिहरू
              </h1>
              
              <p className="nepali-text text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
                मधेश महासभाका आधिकारिक प्रेस विज्ञप्ति, वक्तव्य र घोषणाहरू पढ्नुहोस्
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
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-mm-ink">{allCategories.length}</div>
                    <div className="nepali-text text-sm text-gray-600">विषयवस्तु</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter Section */}
        {allCategories.length > 0 && (
          <section className="py-8 bg-white border-b border-gray-200">
            <div className="container-custom">
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/press-releases"
                  className="px-4 py-2 rounded-lg bg-mm-primary text-white font-medium nepali-text hover:bg-mm-primary/90 transition-colors"
                >
                  सबै ({pressReleases.length})
                </Link>
                {allCategories.map((category) => {
                  const categoryInfo = getCategoryInfo(category);
                  const CategoryIcon = categoryInfo.icon;
                  return (
                    <button
                      key={category}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium nepali-text hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <CategoryIcon className="w-4 h-4" />
                      {categoryInfo.labelNp} ({categoryCounts[category] || 0})
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Featured Press Release */}
        {featuredRelease && (
          <section className="py-16 bg-white">
            <div className="container-custom">
              <div className="mb-8">
                <h2 className="nepali-heading text-3xl md:text-4xl font-bold text-mm-ink mb-2">
                  नवीनतम विज्ञप्ति
                </h2>
                <div className="w-20 h-1 bg-mm-primary rounded-full"></div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Image */}
                {featuredRelease.imageUrl && (
                  <div
                    className="relative rounded-xl overflow-hidden shadow-lg w-full"
                    style={{ aspectRatio: '16 / 9', height: 'auto' }}
                  >
                    <AuthenticatedImage
                      filePath={featuredRelease.imageUrl}
                      alt={featuredRelease.titleNp}
                      className="hover:scale-105 transition-transform duration-500"
                      isPublic={true}
                    />
                  </div>
                )}

                {/* Content */}
                <div className={!featuredRelease.imageUrl ? 'lg:col-span-2' : ''}>
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className={`${getCategoryInfo(featuredRelease.category).color} text-white nepali-text`}>
                      {getCategoryInfo(featuredRelease.category).labelNp}
                    </Badge>
                    {featuredRelease.priority && featuredRelease.priority !== 'normal' && (
                      <Badge className={`${getPriorityInfo(featuredRelease.priority).color} text-white nepali-text`}>
                        {getPriorityInfo(featuredRelease.priority).labelNp}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="nepali-text text-sm">{formatDate(featuredRelease.publishedAt)}</span>
                    </div>
                    {featuredRelease.viewCount > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span className="nepali-text text-sm">{featuredRelease.viewCount} पटक हेरिएको</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="nepali-heading text-3xl md:text-4xl font-bold text-mm-ink mb-4 leading-tight">
                    {featuredRelease.titleNp}
                  </h3>

                  {/* Excerpt */}
                  {featuredRelease.excerptNp && (
                    <p className="nepali-text text-lg text-gray-700 mb-6 leading-relaxed">
                      {featuredRelease.excerptNp}
                    </p>
                  )}

                  {/* Contact Info */}
                  {(featuredRelease.contactEmail || featuredRelease.contactPhone) && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                      <p className="nepali-text text-sm font-semibold text-gray-700 mb-2">सम्पर्क जानकारी:</p>
                      {featuredRelease.contactEmail && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${featuredRelease.contactEmail}`} className="text-sm hover:text-mm-primary transition-colors">
                            {featuredRelease.contactEmail}
                          </a>
                        </div>
                      )}
                      {featuredRelease.contactPhone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${featuredRelease.contactPhone}`} className="text-sm hover:text-mm-primary transition-colors">
                            {featuredRelease.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {featuredRelease.tags && featuredRelease.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredRelease.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full nepali-text"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/press-releases/${featuredRelease.slug}`}
                    className="inline-flex items-center gap-2 bg-mm-primary text-white px-6 py-3 rounded-lg hover:bg-mm-primary/90 transition-all group shadow-md hover:shadow-lg nepali-text font-semibold"
                  >
                    पूर्ण विवरण पढ्नुहोस्
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Press Releases Grid */}
        {otherReleases.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container-custom">
              <div className="mb-12">
                <h2 className="nepali-heading text-3xl md:text-4xl font-bold text-mm-ink mb-2">
                  अन्य विज्ञप्तिहरू
                </h2>
                <div className="w-20 h-1 bg-mm-primary rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherReleases.map((release) => {
                  const categoryInfo = getCategoryInfo(release.category);
                  const CategoryIcon = categoryInfo.icon;
                  
                  return (
                    <article
                      key={release.id}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100"
                    >
                      {/* Image */}
                      {release.imageUrl && (
                        <div
                          className="relative overflow-hidden w-full"
                          style={{ aspectRatio: '16 / 9', height: 'auto' }}
                        >
                          <AuthenticatedImage
                            filePath={release.imageUrl}
                            alt={release.titleNp}
                            className="group-hover:scale-105 transition-transform duration-500"
                            isPublic={true}
                          />
                          {/* Priority Badge Overlay */}
                          {release.priority && release.priority !== 'normal' && (
                            <div className="absolute top-3 right-3">
                              <Badge className={`${getPriorityInfo(release.priority).color} text-white nepali-text text-xs`}>
                                {getPriorityInfo(release.priority).labelNp}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="p-6">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={`${categoryInfo.color} text-white nepali-text text-xs flex items-center gap-1`}>
                            <CategoryIcon className="w-3 h-3" />
                            {categoryInfo.labelNp}
                          </Badge>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span className="nepali-text text-xs">{formatDate(release.publishedAt)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="nepali-heading text-xl font-bold text-mm-ink mb-3 leading-tight group-hover:text-mm-primary transition-colors line-clamp-2">
                          {release.titleNp}
                        </h3>

                        {/* Excerpt */}
                        {release.excerptNp && (
                          <p className="nepali-text text-gray-600 mb-4 leading-relaxed line-clamp-3">
                            {release.excerptNp}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          {release.viewCount > 0 && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Eye className="w-4 h-4" />
                              <span className="nepali-text text-sm">{release.viewCount}</span>
                            </div>
                          )}
                          
                          <Link
                            href={`/press-releases/${release.slug}`}
                            className="text-mm-primary hover:text-mm-primary/80 font-semibold nepali-text text-sm flex items-center gap-1 group/link"
                          >
                            विस्तृत पढ्नुहोस्
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>

                        {/* Tags */}
                        {release.tags && release.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {release.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded nepali-text"
                              >
                                #{tag}
                              </span>
                            ))}
                            {release.tags.length > 3 && (
                              <span className="px-2 py-1 text-gray-500 text-xs nepali-text">
                                +{release.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {pressReleases.length === 0 && (
          <section className="py-20 bg-white">
            <div className="container-custom text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="nepali-heading text-2xl font-bold text-gray-700 mb-3">
                  कुनै प्रेस विज्ञप्ति उपलब्ध छैन
                </h3>
                <p className="nepali-text text-gray-600 mb-6">
                  हामी चाँडै नयाँ प्रेस विज्ञप्तिहरू प्रकाशित गर्नेछौं। कृपया पछि फेरि जाँच गर्नुहोस्।
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-mm-primary text-white px-6 py-3 rounded-lg hover:bg-mm-primary/90 transition-all nepali-text font-semibold"
                >
                  गृहपृष्ठमा फर्कनुहोस्
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-mm-primary to-mm-primary/90">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <Mail className="w-16 h-16 text-white/90 mx-auto mb-6" />
              <h2 className="nepali-heading text-3xl md:text-4xl font-bold text-white mb-4">
                मिडिया सम्पर्क
              </h2>
              <p className="nepali-text text-lg text-white/90 mb-8 leading-relaxed">
                प्रेस विज्ञप्ति सम्बन्धी थप जानकारी वा अन्तर्वार्ताको लागि हामीलाई सम्पर्क गर्नुहोस्
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-mm-primary px-6 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold nepali-text shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  सम्पर्क गर्नुहोस्
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all font-semibold nepali-text"
                >
                  <BookOpen className="w-5 h-5" />
                  हाम्रो बारेमा
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>
      
      <Footer />
    </>
  );
}

import { Footer } from '@/components/Footer';
import { Newsletter } from '@/components/Newsletter';
import newsData from '@/content/news.json';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { 
  Calendar, 
  Tag, 
  ArrowRight, 
  Newspaper,
  BookOpen,
  Users,
  Mail,
  FileText,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
}

const typedNewsData = newsData as Post[];

export const metadata: Metadata = generateMetadata({
  title: 'समाचार र अपडेटहरू',
  description: 'मधेश महासभाका नवीनतम समाचार, घटनाक्रम र कार्यक्रमहरूको जानकारी पाउनुहोस्।',
  path: '/news',
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ne-NP', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const getTagColor = (tag: string) => {
  const colors: { [key: string]: string } = {
    'राजनीति': 'bg-blue-500',
    'समाज': 'bg-green-500',
    'संस्कृति': 'bg-purple-500',
    'अर्थव्यवस्था': 'bg-orange-500',
    'शिक्षा': 'bg-cyan-500',
    'स्वास्थ्य': 'bg-red-500',
    'default': 'bg-mm-primary'
  };
  return colors[tag] || colors['default'];
};

export default function News() {
  const latestNews = typedNewsData && typedNewsData.length > 0 ? typedNewsData[0] : null;
  const otherNews = typedNewsData && typedNewsData.length > 1 ? typedNewsData.slice(1) : [];
  const allTags = typedNewsData ? Array.from(new Set(typedNewsData.map(post => post.tag))) : [];

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
                  <Newspaper className="w-4 h-4 text-mm-primary" />
                  <span className="nepali-heading text-sm font-semibold text-mm-primary">
                    नवीनतम अपडेट
                  </span>
                </div>
              </div>
              
              <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
                समाचार र घटनाक्रम
              </h1>
              
              <p className="nepali-text text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
                मधेश महासभाका नवीनतम समाचार, कार्यक्रम र उपलब्धिहरूको बारेमा अद्यावधिक रहनुहोस्
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-mm-ink">{typedNewsData.length}</div>
                    <div className="nepali-text text-sm text-gray-600">कुल समाचार</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mm-accent rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-mm-ink">{allTags.length}</div>
                    <div className="nepali-text text-sm text-gray-600">कोटीहरू</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* News List */}
              <div className="lg:col-span-2 space-y-8">
                {typedNewsData && typedNewsData.length > 0 ? (
                  <>
                    {/* Featured/Latest News */}
                    {latestNews && (
                      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow group">
                        {/* Featured Badge */}
                        <div className="bg-mm-primary p-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-white" />
                            <span className="nepali-heading text-sm font-semibold text-white">
                              विशेष समाचार
                            </span>
                          </div>
                        </div>
                        
                        {/* Image Placeholder */}
                        <div className="bg-gradient-to-br from-mm-primary/10 to-mm-accent/10 h-72 flex items-center justify-center">
                          <div className="text-center">
                            <Newspaper className="w-20 h-20 text-mm-primary/30 mx-auto mb-4" />
                            <p className="nepali-text text-gray-400">छवि शीघ्र आउँदैछ</p>
                          </div>
                        </div>
                        
                        <div className="p-8">
                          <div className="flex items-center gap-4 mb-4">
                            <span className={`${getTagColor(latestNews.tag)} text-white px-4 py-1.5 rounded-full text-sm font-medium`}>
                              {latestNews.tag}
                            </span>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="w-4 h-4" />
                              <time className="nepali-text text-sm">{formatDate(latestNews.date)}</time>
                            </div>
                          </div>
                          
                          <Link href={`/news/${latestNews.slug}`}>
                            <h2 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-4 group-hover:text-mm-primary transition-colors">
                              {latestNews.title}
                            </h2>
                          </Link>
                          
                          <p className="nepali-text text-lg text-gray-600 mb-6 leading-relaxed">
                            {latestNews.excerpt}
                          </p>
                          
                          <Link 
                            href={`/news/${latestNews.slug}`}
                            className="inline-flex items-center gap-2 bg-mm-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-mm-primary/90 transition-all group"
                          >
                            <span className="nepali-heading">पूर्ण पढ्नुहोस्</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {/* Other News */}
                    {otherNews.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-6 h-6 text-mm-primary" />
                          <h2 className="nepali-heading text-2xl font-bold text-mm-ink">
                            अन्य समाचारहरू
                          </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                          {otherNews.map((post) => (
                            <div 
                              key={post.slug}
                              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all group"
                            >
                              <div className="flex items-start gap-4">
                                {/* Icon/Image placeholder */}
                                <div className={`${getTagColor(post.tag)} w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                  <FileText className="w-8 h-8 text-white" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className={`${getTagColor(post.tag)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                                      {post.tag}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <Calendar className="w-3.5 h-3.5" />
                                      <time className="nepali-text text-xs">{formatDate(post.date)}</time>
                                    </div>
                                  </div>
                                  
                                  <Link href={`/news/${post.slug}`}>
                                    <h3 className="nepali-heading text-xl lg:text-2xl font-bold text-mm-ink mb-2 group-hover:text-mm-primary transition-colors">
                                      {post.title}
                                    </h3>
                                  </Link>
                                  
                                  <p className="nepali-text text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                  </p>
                                  
                                  <Link 
                                    href={`/news/${post.slug}`}
                                    className="inline-flex items-center gap-2 text-mm-primary hover:text-mm-primary/80 font-semibold text-sm group/link"
                                  >
                                    <span className="nepali-heading">थप पढ्नुहोस्</span>
                                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
                    <div className="w-32 h-32 bg-mm-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Newspaper className="w-16 h-16 text-mm-primary" />
                    </div>
                    <h3 className="nepali-heading text-3xl font-bold text-mm-ink mb-4">
                      कुनै समाचार उपलब्ध छैन
                    </h3>
                    <p className="nepali-text text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      हाल कुनै समाचार प्रकाशित गरिएको छैन। नयाँ समाचार र अपडेटहरूको लागि पछि फेरि जाँच गर्नुहोस्।
                    </p>
                    <Link 
                      href="/" 
                      className="inline-flex items-center gap-2 bg-mm-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-mm-primary/90 transition-all"
                    >
                      <span className="nepali-heading">गृहपृष्ठमा फर्कनुहोस्</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Newsletter */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <Newsletter />
                </div>
                
                {/* Tags/Categories */}
                {allTags.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <Tag className="w-5 h-5 text-mm-primary" />
                      <h3 className="nepali-heading text-xl font-bold text-mm-ink">
                        समाचार कोटी
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <span 
                          key={tag}
                          className={`${getTagColor(tag)} text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Links */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <BookOpen className="w-5 h-5 text-mm-primary" />
                    <h3 className="nepali-heading text-xl font-bold text-mm-ink">
                      द्रुत लिङ्कहरू
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <Link 
                      href="/manifesto" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-mm-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-mm-primary/10 rounded-lg flex items-center justify-center group-hover:bg-mm-primary group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5 text-mm-primary group-hover:text-white" />
                      </div>
                      <span className="nepali-text font-medium text-gray-700 group-hover:text-mm-primary">
                        प्रस्तावना पढ्नुहोस्
                      </span>
                    </Link>
                    
                    <Link 
                      href="/agenda" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-mm-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-mm-accent/10 rounded-lg flex items-center justify-center group-hover:bg-mm-accent group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5 text-mm-accent group-hover:text-white" />
                      </div>
                      <span className="nepali-text font-medium text-gray-700 group-hover:text-mm-accent">
                        कार्यसूची हेर्नुहोस्
                      </span>
                    </Link>
                    
                    <Link 
                      href="/join" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-mm-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Users className="w-5 h-5 text-green-500 group-hover:text-white" />
                      </div>
                      <span className="nepali-text font-medium text-gray-700 group-hover:text-green-500">
                        सदस्यता ग्रहण गर्नुहोस्
                      </span>
                    </Link>
                    
                    <Link 
                      href="/contact" 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-mm-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Mail className="w-5 h-5 text-orange-500 group-hover:text-white" />
                      </div>
                      <span className="nepali-text font-medium text-gray-700 group-hover:text-orange-500">
                        सम्पर्क गर्नुहोस्
                      </span>
                    </Link>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-mm-primary rounded-2xl shadow-lg p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="nepali-heading text-xl font-bold mb-3">
                    आन्दोलनमा सामेल हुनुहोस्
                  </h3>
                  <p className="nepali-text text-white/90 mb-5 text-sm leading-relaxed">
                    मधेश महासभाको सदस्य बनेर मधेशी समुदायको उत्थानमा योगदान गर्नुहोस्
                  </p>
                  <Link 
                    href="/join"
                    className="inline-flex items-center gap-2 bg-white text-mm-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-white/90 transition-all w-full justify-center"
                  >
                    <span className="nepali-heading">अभी सामेल हुनुहोस्</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
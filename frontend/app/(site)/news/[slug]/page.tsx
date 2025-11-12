import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/LinkButton';
import { JoinStrip } from '@/components/JoinStrip';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import newsData from '@/content/news.json';
import { formatDate } from '@/lib/utils';
import { generateMetadata as generateSEOMetadata, generateArticleSchema } from '@/lib/seo';
import type { Metadata } from 'next';

interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Type assertion to handle empty array case
  const typedNewsData = newsData as NewsPost[];
  
  if (typedNewsData.length === 0) {
    // Return a fallback static param for empty news data
    return [{ slug: 'no-news' }];
  }
  
  return typedNewsData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const typedNewsData = newsData as NewsPost[];
  const post = typedNewsData.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: 'समाचार फेला परेन',
      description: 'अनुरोध गरिएको समाचार फेला परेन।',
    };
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
    type: 'article',
  });
}

export default async function NewsPost({ params }: PageProps) {
  const { slug } = await params;
  const typedNewsData = newsData as NewsPost[];
  const post = typedNewsData.find((post) => post.slug === slug);

  if (!post || slug === 'no-news') {
    notFound();
  }

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://madheshmahasabha.com/news/${post.slug}`,
    publishedAt: post.date,
    author: 'मधेश महासभा',
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('लिंक कपी भयो!');
    }
  };

  // Related posts (exclude current post)
  const relatedPosts = typedNewsData
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <main id="main-content">
        <Section className="py-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-mm-primary">गृहपृष्ठ</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/news" className="hover:text-mm-primary">समाचार</Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">{post.title}</li>
            </ol>
          </nav>

          {/* Back button */}
          <div className="mb-6">
            <LinkButton variant="ghost" href="/news" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>समाचारमा फर्किनुहोस्</span>
            </LinkButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <article className="lg:col-span-3">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="inline-block bg-mm-primary/10 text-mm-primary px-3 py-1 rounded-full text-sm font-medium">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {post.category}
                  </span>
                  <time 
                    dateTime={post.date}
                    className="flex items-center space-x-1 text-gray-600 text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </time>
                </div>
                
                <h1 className="nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-4">
                  {post.title}
                </h1>
                
                <p className="nepali-text text-xl text-gray-700 leading-relaxed">
                  {post.excerpt}
                </p>
              </header>

              {/* Content */}
              <div className="prose prose-lg max-w-none nepali-text">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.replace(/\n/g, '<br>').replace(/## (.*)/g, '<h2 class="nepali-heading text-2xl font-bold text-mm-ink mt-8 mb-4">$1</h2>').replace(/# (.*)/g, '<h1 class="nepali-heading text-3xl font-bold text-mm-ink mt-8 mb-4">$1</h1>') 
                  }} 
                />
              </div>

              {/* Share */}
              <div className="border-t border-gray-200 pt-6 mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="nepali-heading font-semibold mb-2">यो समाचार साझा गर्नुहोस्</h3>
                  </div>
                  <ShareButton 
                    title={post.title}
                    text={post.excerpt}
                  />
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="nepali-heading font-semibold mb-4">अन्य समाचारहरू</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/news/${relatedPost.slug}`}
                        className="block group"
                      >
                        <h4 className="nepali-heading font-medium text-sm group-hover:text-mm-primary transition-colors leading-tight mb-2">
                          {relatedPost.title}
                        </h4>
                        <time 
                          dateTime={relatedPost.date}
                          className="text-xs text-gray-500"
                        >
                          {formatDate(relatedPost.date)}
                        </time>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <LinkButton variant="outline" size="sm" href="/news">
                      सबै समाचार हेर्नुहोस्
                    </LinkButton>
                  </div>
                </div>
              )}

              {/* Call to action */}
              <div className="bg-mm-primary/5 border border-mm-primary/20 rounded-lg p-6">
                <h3 className="nepali-heading font-semibold mb-3">
                  हामीसँग जुट्नुहोस्
                </h3>
                <p className="nepali-text text-sm text-gray-700 mb-4">
                  मधेश महासभामा सदस्यता ग्रहण गरी परिवर्तनको भागीदार बन्नुहोस्।
                </p>
                <LinkButton size="sm" href="/join">
                  सदस्यता ग्रहण गर्नुहोस्
                </LinkButton>
              </div>
            </aside>
          </div>
        </Section>

        <JoinStrip />
      </main>

      <Footer />
    </>
  );
}
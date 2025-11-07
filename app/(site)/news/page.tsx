import { Footer } from '@/components/Footer';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { PostList } from '@/components/PostList';
import { JoinStrip } from '@/components/JoinStrip';
import { Newsletter } from '@/components/Newsletter';
import newsData from '@/content/news.json';
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'समाचार र अपडेटहरू',
  description: 'मधेश महासभाका नवीनतम समाचार, घटनाक्रम र कार्यक्रमहरूको जानकारी पाउनुहोस्।',
  path: '/news',
});

export default function News() {
  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section background="pattern" className="py-16">
          <SectionHeader>
            <SectionTitle as="h1" className="text-4xl lg:text-5xl">
              समाचार र अपडेटहरू
            </SectionTitle>
            <SectionDescription>
              मधेश महासभाका नवीनतम समाचार, घटनाक्रम र कार्यक्रमहरूको जानकारी
            </SectionDescription>
          </SectionHeader>
        </Section>

        {/* News List */}
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {newsData && newsData.length > 0 ? (
                <PostList posts={newsData} />
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-20 h-20 bg-mm-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-mm-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="nepali-heading text-2xl font-bold text-mm-ink mb-3">
                    कुनै समाचार उपलब्ध छैन
                  </h3>
                  <p className="nepali-text text-gray-600 mb-6">
                    हाल कुनै समाचार प्रकाशित गरिएको छैन। नयाँ समाचार र अपडेटहरूको लागि पछि फेरि जाँच गर्नुहोस्।
                  </p>
                  <a 
                    href="/" 
                    className="inline-block bg-mm-primary text-white px-6 py-3 rounded-md font-nepali-heading font-semibold hover:bg-mm-primary/90 transition-colors"
                  >
                    गृहपृष्ठमा फर्कनुहोस्
                  </a>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <aside className="space-y-8">
              <Newsletter />
              
              {/* Recent Tags */}
              {newsData && newsData.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="nepali-heading font-semibold mb-4">समाचार कोटी</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(newsData.map(post => post.tag))).map(tag => (
                      <span 
                        key={tag}
                        className="inline-block bg-mm-primary/10 text-mm-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="nepali-heading font-semibold mb-4">द्रुत लिङ्कहरू</h3>
                <div className="space-y-2">
                  <a href="/manifesto" className="block text-mm-primary hover:underline">
                    प्रस्तावना पढ्नुहोस्
                  </a>
                  <a href="/agenda" className="block text-mm-primary hover:underline">
                    कार्यसूची हेर्नुहोस्
                  </a>
                  <a href="/join" className="block text-mm-primary hover:underline">
                    सदस्यता ग्रहण गर्नुहोस्
                  </a>
                  <a href="/contact" className="block text-mm-primary hover:underline">
                    सम्पर्क गर्नुहोस्
                  </a>
                </div>
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
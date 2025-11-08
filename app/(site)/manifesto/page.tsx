import { Footer } from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { LinkButton } from '@/components/ui/LinkButton';
import { JoinStrip } from '@/components/JoinStrip';
import { ManifestoActions } from './ManifestoActions';
import { ManifestoTOC } from './ManifestoTOC';
import { Users, Target, Heart, Shield, Lightbulb, BookOpen } from 'lucide-react';
import { generateMetadata, generateArticleSchema } from '@/lib/seo';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = generateMetadata({
  title: 'प्रस्तावना र संस्थापक दस्तावेज',
  description: 'मधेश महासभाको पूर्ण प्रस्तावना पढ्नुहोस्। मधेशी समुदायको एकता, समानता र अधिकारका लागि हाम्रो दर्शन र योजना।',
  path: '/manifesto',
  type: 'article',
});

// Read manifesto content from markdown file
function getManifestoContent() {
  const manifestoPath = path.join(process.cwd(), 'content', 'manifesto.np.md');
  try {
    const content = fs.readFileSync(manifestoPath, 'utf8');
    // Remove the title and author lines as they're handled by the layout
    return content
      .replace(/^# मधेश महासभाको प्रस्तावना\n*/m, '')
      .replace(/---\n\n\*\*लेखक\*\*: बीपी साह$/m, '')
      .trim();
  } catch (error) {
    return 'प्रस्तावना लोड गर्न सकिएन।';
  }
}

// Simple markdown-to-HTML converter for Nepali content
function parseMarkdown(content: string) {
  return content
    .replace(/^## (.+)$/gm, '<h2 id="$1" class="nepali-heading text-4xl lg:text-5xl font-bold text-mm-ink mb-8 mt-16 scroll-mt-24">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="nepali-heading text-2xl lg:text-3xl font-semibold text-mm-ink mb-6 mt-10">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-mm-accent">$1</strong>')
    .replace(/\n\n/g, '</p><p class="nepali-text text-xl lg:text-2xl leading-relaxed mb-8 text-gray-700">')
    .replace(/^(.+)$/gm, '<p class="nepali-text text-xl lg:text-2xl leading-relaxed mb-8 text-gray-700">$1</p>')
    .replace(/<p class="nepali-text text-xl lg:text-2xl leading-relaxed mb-8 text-gray-700"><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
}

// Extract table of contents from markdown
function extractTOC(content: string) {
  const headings = content.match(/^## (.+)$/gm);
  if (!headings) return [];
  return headings.map(h => h.replace('## ', ''));
}

export default function Manifesto() {
  const manifestoContent = getManifestoContent();
  const parsedContent = parseMarkdown(manifestoContent);
  const tableOfContents = extractTOC(manifestoContent);
  
  const articleSchema = generateArticleSchema({
    title: 'मधेश महासभाको प्रस्तावना',
    description: 'मधेशी समुदायको एकता, समानता र अधिकारका लागि प्रस्तावना',
    url: 'https://madheshmahasabha.com/manifesto',
    publishedAt: '2024-01-15T00:00:00Z',
    author: 'बीपी साह',
  });

  const keyHighlights = [
    { icon: Target, title: 'हाम्रो लक्ष्य', desc: 'मधेशी समुदायको एकता र अधिकार' },
    { icon: Heart, title: 'हाम्रो मूल्य', desc: 'समानता, न्याय र सम्मान' },
    { icon: Shield, title: 'हाम्रो शक्ति', desc: 'संगठित जनशक्ति' },
    { icon: Lightbulb, title: 'हाम्रो दृष्टि', desc: 'समृद्ध र समावेशी मधेश' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <main id="main-content" className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <Section className="py-16 lg:py-24 bg-gradient-to-br from-mm-primary/5 via-white to-mm-accent/5 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-mm-primary/5 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-mm-accent/5 rounded-full blur-3xl -z-0"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                <BookOpen className="w-5 h-5 text-mm-primary" />
                <span className="nepali-heading text-sm font-semibold text-mm-primary">
                  आधिकारिक प्रस्तावना
                </span>
              </div>
            </div>
            
            <h1 className="nepali-heading text-5xl md:text-6xl lg:text-7xl font-bold text-mm-ink mb-6 leading-tight">
              मधेश महासभाको<br />
              <span className="text-mm-primary">प्रस्तावना</span>
            </h1>
            
            <p className="nepali-text text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              मधेश र मधेशी समुदायको एकता, समानता र अधिकारका लागि हाम्रो दर्शन, लक्ष्य र कार्ययोजना
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {keyHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-mm-primary/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                      <Icon className="w-5 h-5 text-mm-primary" />
                    </div>
                    <h3 className="nepali-heading text-base font-bold text-mm-ink mb-1">
                      {item.title}
                    </h3>
                    <p className="nepali-text text-sm text-gray-600">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Main Content */}
        <Section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Table of Contents - Left Sidebar */}
              <aside className="lg:w-72 order-2 lg:order-1">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* TOC */}
                  <ManifestoTOC headings={tableOfContents} />

                  {/* Actions */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="nepali-heading font-bold text-mm-ink mb-4 text-lg">
                      कार्यहरू
                    </h3>
                    <div className="space-y-3">
                      <LinkButton 
                        className="w-full flex items-center justify-center gap-2 text-base" 
                        href="/join"
                      >
                        <Users className="w-5 h-5" />
                        <span>सदस्यता लिनुहोस्</span>
                      </LinkButton>
                      
                      <ManifestoActions />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <article className="flex-1 order-1 lg:order-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
                  {/* Content */}
                  <div 
                    className="prose prose-lg max-w-none manifesto-content"
                    dangerouslySetInnerHTML={{ __html: parsedContent }} 
                  />

                  {/* Author Attribution */}
                  <div className="border-t border-gray-200 pt-8 mt-12">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-mm-primary/10 rounded-full flex items-center justify-center">
                        <span className="nepali-heading text-2xl font-bold text-mm-primary">
                          बी
                        </span>
                      </div>
                      <div>
                        <p className="nepali-heading text-base text-gray-500 mb-1">
                          लेखक
                        </p>
                        <p className="nepali-heading text-xl font-bold text-mm-ink">
                          बीपी साह
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="mt-12 p-6 lg:p-8 bg-mm-primary rounded-2xl text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="nepali-heading text-2xl lg:text-3xl font-bold mb-2">
                          मधेश महासभामा सामेल हुनुहोस्
                        </h3>
                        <p className="nepali-text text-lg text-white/90">
                          हाम्रो आन्दोलनमा योगदान गर्नुहोस् र परिवर्तनको भागीदार बन्नुहोस्
                        </p>
                      </div>
                      <LinkButton 
                        href="/join"
                        className="bg-white text-mm-primary hover:bg-gray-50 whitespace-nowrap flex-shrink-0 text-base"
                      >
                        अहिले सामेल हुनुहोस्
                      </LinkButton>
                    </div>
                  </div>
                </div>
              </article>

              {/* Right Sidebar - Quotes */}
              <aside className="lg:w-80 order-3">
                <div className="lg:sticky lg:top-24 space-y-6">
                  {/* Key Quote 1 */}
                  <div className="bg-gradient-to-br from-mm-primary/5 to-mm-primary/10 border-l-4 border-mm-primary rounded-r-xl p-6">
                    <svg className="w-10 h-10 text-mm-primary/30 mb-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <blockquote className="nepali-text text-xl font-medium text-mm-ink mb-3 leading-relaxed">
                      आखिर, कहिलेसम्म यस्तै चल्ने?
                    </blockquote>
                    <cite className="nepali-text text-base text-gray-600 not-italic">
                      — प्रस्तावनाबाट
                    </cite>
                  </div>

                  {/* Key Quote 2 */}
                  <div className="bg-gradient-to-br from-mm-accent/5 to-mm-accent/10 border-l-4 border-mm-accent rounded-r-xl p-6">
                    <svg className="w-10 h-10 text-mm-accent/30 mb-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <blockquote className="nepali-text text-xl font-medium text-mm-ink mb-3 leading-relaxed">
                      एकता नै हाम्रो शक्ति हो।
                    </blockquote>
                    <cite className="nepali-text text-base text-gray-600 not-italic">
                      — मधेश महासभा
                    </cite>
                  </div>

                  {/* Impact Stats */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="nepali-heading font-bold text-mm-ink mb-4 text-lg">
                      किन यो महत्त्वपूर्ण छ?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-mm-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="nepali-text text-base text-gray-600">
                          मधेशी समुदायको ऐतिहासिक संघर्ष र अधिकारको दस्तावेज
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-mm-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="nepali-text text-base text-gray-600">
                          भविष्यका पुस्ताका लागि समानताको मार्गदर्शन
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-mm-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="nepali-text text-base text-gray-600">
                          राजनीतिक एकता र संगठित शक्तिको आधार
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Section>

        <JoinStrip />
      </main>

      <Footer />
    </>
  );
}
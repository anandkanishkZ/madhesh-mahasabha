import { Footer } from '@/components/Footer';
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/LinkButton';
import { JoinStrip } from '@/components/JoinStrip';
import { Share2, Download, Users } from 'lucide-react';
import Link from 'next/link';
import { generateMetadata, generateArticleSchema } from '@/lib/seo';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = generateMetadata({
  title: 'प्रस्तावना - मधेश महासभा',
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
    .replace(/^## (.+)$/gm, '<h2 class="nepali-heading text-2xl font-bold text-mm-ink mb-4 mt-8">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="nepali-heading text-xl font-semibold text-mm-ink mb-3 mt-6">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-mm-accent">$1</strong>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
    .replace(/<p class="mb-4"><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>');
}

export default function Manifesto() {
  const manifestoContent = getManifestoContent();
  const parsedContent = parseMarkdown(manifestoContent);
  
  const articleSchema = generateArticleSchema({
    title: 'मधेश महासभाको प्रस्तावना',
    description: 'मधेशी समुदायको एकता, समानता र अधिकारका लागि प्रस्तावना',
    url: 'https://madheshmahasabha.com/manifesto',
    publishedAt: '2024-01-15T00:00:00Z',
    author: 'बीपी साह',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <main id="main-content">
        <Section className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="nepali-heading text-4xl lg:text-5xl font-bold text-mm-ink mb-6">
                मधेश महासभाको प्रस्तावना
              </h1>
              <p className="nepali-text text-lg text-gray-600">
                मधेश र मधेशी समुदायको एकता, समानता र अधिकारका लागि
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Content */}
              <article className="flex-1 prose prose-lg max-w-none">
                <div className="nepali-text text-lg leading-relaxed space-y-6">
                  {/* Actual manifesto content */}
                  <div dangerouslySetInnerHTML={{ __html: parsedContent }} />

                  {/* Author attribution */}
                  <div className="border-t border-gray-200 pt-6 mt-8">
                    <p className="nepali-heading text-lg font-semibold text-mm-ink">
                      लेखक: बीपी साह
                    </p>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:w-80">
                <div className="sticky top-24 space-y-6">
                  {/* Action buttons */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="nepali-heading font-semibold mb-4">
                      कार्यहरू
                    </h3>
                    <div className="space-y-3">
                      <LinkButton className="w-full flex items-center space-x-2" href="/join">
                        <Users className="w-4 h-4" />
                        <span>सदस्यता ग्रहण गर्नुहोस्</span>
                      </LinkButton>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <div className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-nepali-heading font-semibold rounded-md border-2 border-mm-primary text-mm-primary gap-2 opacity-50 cursor-not-allowed">
                          <Share2 className="w-4 h-4" />
                          साझा गर्नुहोस्
                        </div>
                        <div className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-nepali-heading font-semibold rounded-md border-2 border-mm-primary text-mm-primary gap-2 opacity-50 cursor-not-allowed">
                          <Download className="w-4 h-4" />
                          डाउनलोड गर्नुहोस्
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pull quotes */}
                  <div className="bg-mm-primary/5 border-l-4 border-mm-primary rounded-r-lg p-6">
                    <blockquote className="nepali-text text-lg font-medium text-mm-ink mb-3">
                      "आखिर, कहिलेसम्म यस्तै चल्ने?"
                    </blockquote>
                    <cite className="text-sm text-gray-600">— प्रस्तावनाबाट</cite>
                  </div>

                  <div className="bg-mm-accent/5 border-l-4 border-mm-accent rounded-r-lg p-6">
                    <blockquote className="nepali-text text-lg font-medium text-mm-ink mb-3">
                      "एकता नै हाम्रो शक्ति हो।"
                    </blockquote>
                    <cite className="text-sm text-gray-600">— प्रस्तावनाबाट</cite>
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
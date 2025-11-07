interface QuoteBannerProps {
  quote: string;
  attribution?: string;
  className?: string;
}

export function QuoteBanner({ quote, attribution, className = '' }: QuoteBannerProps) {
  return (
    <section className={`py-16 lg:py-20 bg-mm-primary text-white ${className}`}>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="nepali-text text-2xl sm:text-3xl lg:text-4xl font-medium leading-relaxed mb-6">
            "{quote}"
          </blockquote>
          {attribution && (
            <cite className="nepali-heading text-lg font-semibold opacity-90">
              — {attribution}
            </cite>
          )}
        </div>
      </div>
    </section>
  );
}
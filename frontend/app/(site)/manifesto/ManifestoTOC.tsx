'use client';

import { useEffect, useState } from 'react';

interface ManifestoTOCProps {
  headings: string[];
}

export function ManifestoTOC({ headings }: ManifestoTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      }
    );

    // Observe all h2 elements
    const headingElements = headings.map((heading) =>
      document.getElementById(heading)
    );

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, heading: string) => {
    e.preventDefault();
    const element = document.getElementById(heading);
    if (element) {
      const yOffset = -100; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(heading);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-mm-primary rounded-full"></div>
        <h3 className="nepali-heading font-bold text-mm-ink text-lg">
          विषय सूची
        </h3>
      </div>
      <nav className="space-y-2">
        {headings.map((heading, idx) => {
          const isActive = activeId === heading;
          return (
            <a
              key={idx}
              href={`#${heading}`}
              onClick={(e) => handleClick(e, heading)}
              className={`
                block nepali-text text-base transition-all py-2 px-3 rounded-lg
                ${
                  isActive
                    ? 'text-mm-primary bg-mm-primary/10 translate-x-1 font-semibold'
                    : 'text-gray-600 hover:text-mm-primary hover:bg-mm-primary/5 hover:translate-x-1'
                }
              `}
            >
              <span
                className={`
                  inline-block w-7 h-7 text-sm rounded-full mr-2 text-center leading-7 font-semibold
                  ${
                    isActive
                      ? 'bg-mm-primary text-white'
                      : 'bg-mm-primary/10 text-mm-primary'
                  }
                `}
              >
                {idx + 1}
              </span>
              {heading}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

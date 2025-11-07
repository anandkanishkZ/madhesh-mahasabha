import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function JoinStrip() {
  return (
    <section className="py-12 bg-mm-primary text-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          <div className="text-center lg:text-left">
            <h3 className="nepali-heading text-2xl lg:text-3xl font-bold mb-2">
              मधेश महासभामा सामेल हुनुहोस्
            </h3>
            <p className="nepali-text text-lg lg:text-xl opacity-90 max-w-2xl">
              एकता, समानता र अधिकारका लागि हामीसँग जुट्नुहोस्। सँगै मिलेर परिवर्तन ल्याउनुहोस्।
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/join" 
              className="inline-flex items-center justify-center h-14 px-8 py-4 text-lg font-nepali-heading font-semibold rounded-md bg-white text-mm-primary hover:bg-white/90 transition-colors duration-300 space-x-2"
            >
              <span>अहिले नै सामेल हुनुहोस्</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              href="/manifesto"
              className="inline-flex items-center justify-center h-14 px-8 py-4 text-lg font-nepali-heading font-semibold rounded-md border-2 border-white text-white hover:bg-white hover:text-mm-primary transition-colors duration-300"
            >
              प्रस्तावना पढ्नुहोस्
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
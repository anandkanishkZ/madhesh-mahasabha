# मधेश महासभा (Madhesh Mahasabha) Website

A beautiful, responsive, and accessible website for Madhesh Mahasabha built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Nepali-first Design** with beautiful typography using Noto Sans Devanagari and Mukta fonts
- **Fully Responsive** design that works on all devices
- **Accessibility Compliant** (WCAG 2.1 AA) with proper focus states and ARIA labels
- **SEO Optimized** with proper metadata and JSON-LD structured data
- **Frontend-only** - No backend required, uses mailto for forms
- **Static Site Generation** for optimal performance

## 🎨 Brand Colors

- **Primary**: `#135D3B` (Deep Green)
- **Accent**: `#C62828` (Mithila Red) 
- **Warm**: `#F4A300` (Marigold)
- **Text**: `#1E2428` (Ink)
- **Background**: `#FAF8F3` (Cream)

## 📁 Project Structure

```
/app
  /(site)
    /page.tsx                # Home page
    /about/page.tsx         # About page
    /manifesto/page.tsx     # Manifesto page
    /agenda/page.tsx        # Agenda page
    /join/page.tsx          # Membership form
    /news/page.tsx          # News list
    /news/[slug]/page.tsx   # Individual news posts
    /resources/page.tsx     # Resources page
    /contact/page.tsx       # Contact page
  /layout.tsx               # Root layout
  /globals.css             # Global styles
  /sitemap.xml/route.ts    # Dynamic sitemap
  /robots.txt/route.ts     # Robots.txt

/components
  /ui/                     # Reusable UI components
  /Header.tsx             # Site header with navigation
  /Footer.tsx             # Site footer
  /Hero.tsx               # Homepage hero section
  /QuoteBanner.tsx        # Quote display component
  /PostList.tsx           # News posts grid
  /LangToggle.tsx         # Language switcher
  /JoinStrip.tsx          # Call-to-action strip
  /Newsletter.tsx         # Newsletter signup

/content
  manifesto.np.md         # Manifesto content in Nepali
  news.json              # News posts data
  agenda.np.json         # Agenda items data

/lib
  seo.ts                 # SEO utilities and JSON-LD
  utils.ts               # Utility functions

/public
  logo.svg               # Organization logo
  og.png                 # Open Graph image
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd madhesh-mahasabha-website
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
# or
yarn install
# or  
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Static Export

For static hosting, add to `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig
```

Then run:
```

## 📧 Forms & Contact

All forms use `mailto:` links that open the user's email client with pre-filled content:

- **Membership Form**: `/join` - Comprehensive membership application
- **Contact Form**: `/contact` - General inquiries  
- **Newsletter**: Placeholder for future implementation

Contact email: **mahasabhamadhesh@gmail.com**

## 🎯 Content Management

### Adding News Posts

Edit `/content/news.json`:

```json
{
  "slug": "post-slug",
  "title": "Post Title in Nepali",
  "excerpt": "Brief description...",
  "date": "2024-01-15",
  "tag": "Category",
  "content": "Full markdown content..."
}
```

### Updating Manifesto

Edit `/content/manifesto.np.md` with your full manifesto text.

### Modifying Agenda

Edit `/content/agenda.np.json` to update policy points by category.

## 🔧 Customization

### Colors

Update CSS variables in `/app/globals.css`:

```css
:root {
  --mm-primary: #135D3B;
  --mm-accent: #C62828;
  --mm-warm: #F4A300;
  --mm-ink: #1E2428;
  --mm-bg: #FAF8F3;
}
```

### Fonts

Modify font imports in `/app/layout.tsx` if needed.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support or questions:
- Email: mahasabhamadhesh@gmail.com
- Website: [madheshmahasabha.com](https://madheshmahasabha.com)

---

**Built with ❤️ for the Madhesh community**

*मधेश र मधेशीको एकता, समानता र अधिकारका लागि*
  "tag": "Category",
  "content": "Full article content in Markdown"
}
```

### Updating Manifesto

Replace the placeholder content in `content/manifesto.np.md` with the full manifesto text.

### Modifying Agenda

Update `content/agenda.np.json` with agenda items organized by category.

## Customization

### Brand Colors

Colors are defined as CSS custom properties in `app/globals.css`:

- `--mm-primary`: #135D3B (Deep Green)
- `--mm-accent`: #C62828 (Mithila Red)  
- `--mm-warm`: #F4A300 (Marigold)
- `--mm-ink`: #1E2428 (Text)
- `--mm-bg`: #FAF8F3 (Background)

### Typography

The site uses three font families:
- **Nepali Body**: Noto Sans Devanagari
- **Nepali Headings**: Mukta (700/800 weights)
- **English**: Inter (fallback)

## Forms and Contact

All forms use `mailto:` links since this is a frontend-only application:
- Membership form (`/join`) 
- Contact form (`/contact`)
- Newsletter subscription

Forms validate client-side and open the user's email client with pre-filled content.

## Deployment

The site is configured for static export and can be deployed to:
- Vercel (recommended)
- Netlify  
- GitHub Pages
- Any static hosting service

Build command: `npm run build`
Output directory: `out/`

## SEO & Analytics

- Complete meta tags for all pages
- Open Graph and Twitter Card support
- JSON-LD structured data (Organization, WebSite, Article)
- Sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Analytics placeholder (ready for Google Analytics 4)

## Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for images
- ARIA labels and landmarks
- Keyboard navigation support
- Focus management
- Skip to content link
- Screen reader friendly

## Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+
- Mobile browsers with ES2020 support

## License

This project is created for मधेश महासभा (Madhesh Mahasabha).

## Contact

For questions or support, contact: mahasabhamadhesh@gmail.com

---

**मधेश महासभा** - मधेश र मधेशीको एकता, समानता र अधिकारका लागि
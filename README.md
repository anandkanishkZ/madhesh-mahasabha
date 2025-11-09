# Madhesh Mahasabha

This is the main project repository for Madhesh Mahasabha.

## Project Structure

```
project/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utility functions and data
│   ├── content/      # Content files (manifesto, news, etc.)
│   ├── public/       # Static assets
│   └── ...           # Configuration files
├── firestore.rules   # Firebase Firestore security rules (production)
└── firestore.production.rules  # Firebase Firestore security rules
```

## Frontend

The frontend is a Next.js 13+ application with TypeScript and Tailwind CSS.

### Getting Started

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Key Features

- **Mission Representative Registration**: Dynamic form with cascading location dropdowns
- **Multilingual Support**: Nepali and English content
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Location Data**: Province → District → Constituency → Municipality
- **Modern UI**: Professional design with smooth animations

## Firebase Configuration

Firebase security rules are stored in the root directory:
- `firestore.rules` - Development rules
- `firestore.production.rules` - Production rules

## Contributing

Please read the contributing guidelines before making any changes.

## License

Copyright © 2025 Madhesh Mahasabha. All rights reserved.

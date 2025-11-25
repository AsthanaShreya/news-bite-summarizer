# NewsBite - AI News Summarizer

## About

NewsBite is an AI-powered news summarization tool that transforms long articles into quick, digestible summaries. Simply paste any article and get instant key points, sentiment analysis, and reading time estimates.

## Features

- **AI-Powered Summarization**: Leverages Google Gemini AI for intelligent article summarization
- **Sentiment Analysis**: Automatically detects article sentiment (positive, negative, neutral)
- **Key Highlights**: Extracts 3-5 key points from any article
- **Reading Time**: Calculates word count and estimated reading time
- **Smart Keywords**: Identifies 5-7 relevant keywords from the content
- **History Tracking**: Saves your last 5 summaries for easy access
- **Sample Article**: Try it out with a pre-loaded sample article

## Technologies

This project is built with modern web technologies:

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-ui** - Beautiful UI components
- **Supabase** - Backend and edge functions
- **Google Gemini AI** - AI summarization engine

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd newsbite

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

You'll also need to configure the `GEMINI_API_KEY` secret in your Supabase edge function environment.

## Development

### Project Structure

```
newsbite/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   └── integrations/    # API integrations
├── supabase/
│   └── functions/       # Edge functions
└── public/              # Static assets
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

You can deploy this application to any static hosting service that supports React applications:

- Vercel
- Netlify
- GitHub Pages
- Any cloud provider

Make sure to configure your environment variables in your deployment platform.

## License

This project is open source and available under the MIT License.

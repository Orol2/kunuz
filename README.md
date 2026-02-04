# Kun.uz News Scraper

A modern, responsive Next.js application that scrapes and displays the latest news articles from [kun.uz](https://kun.uz), Uzbekistan's leading news portal. Built with Next.js 14, TypeScript, and Tailwind CSS, optimized for deployment on AWS Amplify.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Features

- 🚀 **Next.js 14 App Router** - Modern React framework with server-side rendering
- 📰 **Real-time News Scraping** - Fetches latest articles from kun.uz
- 🎨 **Beautiful UI** - Clean, responsive card-based layout with Tailwind CSS
- ⚡ **Performance Optimized** - Caching, lazy loading, and optimized images
- 🔄 **Auto-refresh** - Manual refresh button to fetch latest news
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🛡️ **Error Handling** - Graceful error messages and loading states
- 🌐 **SEO Optimized** - Meta tags and Open Graph support
- ☁️ **AWS Amplify Ready** - Configured for seamless deployment

## Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Scraping**: Cheerio & Axios
- **Deployment**: AWS Amplify

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Orol2/kunuz.git
cd kunuz
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 4. Build for production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
kunuz/
├── app/
│   ├── api/
│   │   └── news/
│   │       └── route.ts       # API endpoint for scraping news
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Homepage with news display
│   └── globals.css            # Global styles
├── public/                    # Static assets
├── .gitignore
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md
```

## API Routes

### GET `/api/news`

Fetches the latest news articles from kun.uz.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "unique-id",
      "title": "Article Title",
      "summary": "Article summary or description",
      "imageUrl": "https://...",
      "articleUrl": "https://kun.uz/...",
      "publishDate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 12,
  "cachedAt": "2024-01-01T00:00:00.000Z"
}
```

**Features:**
- 5-minute caching to respect rate limits
- Error handling with detailed messages
- Returns up to 12 latest articles
- Fallback images for missing article images

## Deployment

### Deploy to AWS Amplify

#### Method 1: Using Amplify Console (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select the branch (e.g., `main`)

3. **Configure build settings**
   
   Amplify should auto-detect Next.js settings. If not, use:
   
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Deploy**
   - Click "Save and deploy"
   - Wait for the build to complete
   - Your app will be available at: `https://[app-id].amplifyapp.com`

#### Method 2: Using Amplify CLI

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify**
   ```bash
   amplify init
   ```

3. **Add hosting**
   ```bash
   amplify add hosting
   ```
   - Choose "Hosting with Amplify Console"
   - Choose "Manual deployment"

4. **Deploy**
   ```bash
   amplify publish
   ```

### Environment Variables

No environment variables are required for basic functionality. If you want to add custom configurations:

1. Create a `.env.local` file (for local development)
2. Add variables to Amplify Console under App settings → Environment variables

Example:
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

## Configuration

### Next.js Configuration

The `next.config.js` is optimized for Amplify:

```javascript
{
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  },
  output: 'standalone'
}
```

### Caching Strategy

- API responses are cached for 5 minutes
- Browser cache: `s-maxage=300, stale-while-revalidate=600`
- Prevents rate limiting and improves performance

## Customization

### Styling

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Scraping Logic

Edit `app/api/news/route.ts` to modify:
- Number of articles fetched
- Scraping selectors
- Cache duration
- Error handling

### UI Components

Edit `app/page.tsx` to customize:
- Layout and design
- Loading states
- Error messages
- Card styling

## Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Server-side caching for API responses
- **Code Splitting**: Automatic with Next.js App Router
- **Static Assets**: Served from CDN when deployed
- **Responsive Images**: Tailwind CSS responsive utilities

## Security & Best Practices

- ✅ Respects robots.txt
- ✅ Rate limiting with caching
- ✅ Proper error handling
- ✅ User-Agent headers
- ✅ HTTPS only for external requests
- ✅ No sensitive data in client-side code
- ✅ XSS protection with React
- ✅ CORS headers configured

## Troubleshooting

### Build fails on Amplify

- Ensure Node.js version is 18+ in Amplify settings
- Check build logs for missing dependencies
- Verify `package.json` has all required dependencies

### News articles not loading

- Check if kun.uz website structure has changed
- Update scraping selectors in `app/api/news/route.ts`
- Check browser console for API errors

### Images not displaying

- Verify remote patterns in `next.config.js`
- Check image URLs in the API response
- Fallback placeholder images are automatic

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This application is for educational purposes only. Please respect kun.uz's terms of service and robots.txt. Always check the website's scraping policy before deploying to production.

## Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## Acknowledgments

- News content provided by [kun.uz](https://kun.uz)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Deployed on [AWS Amplify](https://aws.amazon.com/amplify)

---

Made with ❤️ for the Uzbekistan tech community

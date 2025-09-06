# English Learning Platform

A modern web application for learning English built with Nuxt 3, Supabase, and TypeScript.

## Features

- 🎯 **Interactive Lessons**: Structured lessons from beginner to advanced levels
- 📚 **Multiple Exercise Types**: Multiple choice, fill-in-the-blank, translation, and listening exercises
- 📊 **Progress Tracking**: Monitor your learning journey with detailed progress reports
- 🔐 **User Authentication**: Secure user registration and login with Supabase Auth
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean and intuitive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Pinia
- **Deployment**: Vercel/Netlify ready

## Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gpt_english_web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env` and fill in your Supabase credentials:
     ```env
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL commands from `supabase-schema.sql` to create the database schema

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
├── assets/css/          # Global styles and Tailwind configuration
├── components/          # Reusable Vue components
├── composables/         # Vue composables (useSupabase, etc.)
├── pages/              # Application pages and routing
│   ├── auth/           # Authentication pages
│   └── lessons/        # Lesson-related pages
├── stores/             # Pinia stores for state management
├── types/              # TypeScript type definitions
├── app.vue             # Root component
├── nuxt.config.ts      # Nuxt configuration
└── supabase-schema.sql # Database schema
```

## Database Schema

The application uses the following main tables:

- **users**: User profiles (extends Supabase auth.users)
- **lessons**: Learning content organized by level and category
- **exercises**: Practice exercises linked to lessons
- **user_progress**: Tracks completion and scores
- **user_profiles**: User learning statistics and preferences

## Features Overview

### Authentication
- User registration and login
- Email verification
- Password reset functionality
- Protected routes

### Learning System
- **Lessons**: Structured content with multiple difficulty levels
- **Exercises**: Various types of practice activities
- **Progress Tracking**: Monitor completion and performance
- **Level System**: Beginner, Intermediate, Advanced

### User Interface
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, intuitive interface
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for fast loading

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Vue 3 Composition API

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `.output` folder to your hosting provider
3. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Social learning features
- [ ] AI-powered personalized recommendations
- [ ] Offline learning support
- [ ] Multi-language support
- [ ] Gamification elements
- [ ] Video lessons integration
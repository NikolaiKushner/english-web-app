# 🎓 English Learning Platform with AI

A modern, AI-powered English learning platform built with Nuxt 3, Supabase, and OpenAI.

## ✨ Features

- 🤖 **AI-Powered Learning**: Generate unlimited custom exercises with ChatGPT
- 🎯 **Interactive Lessons**: Structured content from beginner to advanced
- 💡 **Smart Explanations**: AI provides detailed feedback and learning tips
- 📊 **Progress Tracking**: Monitor your learning journey with analytics
- 🔐 **Secure Authentication**: User accounts with Supabase Auth
- 📱 **Responsive Design**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.0+
- Supabase account
- OpenAI API key (optional, for AI features)

### Setup
1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd gpt_english_web
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your `.env` file:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key  # Optional
   ```

3. **Database Setup**
   - Run `supabase-schema.sql` in your Supabase SQL Editor

4. **Start Development**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## 🎯 AI Features

### Without OpenAI API Key
- ✅ All basic learning features work
- ✅ Pre-built lessons and exercises
- ✅ Progress tracking
- ❌ AI exercise generation disabled
- ❌ AI explanations disabled

### With OpenAI API Key
- ✅ Generate unlimited custom exercises
- ✅ AI-powered explanations and tips
- ✅ Personalized learning feedback
- ✅ Smart recommendations

> **Note**: AI features gracefully degrade if OpenAI API is unavailable or quota exceeded.

## 🛠️ Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth)
- **AI**: OpenAI GPT-3.5-turbo
- **State**: Pinia stores

## 📁 Key Files

```
app/
├── components/
│   ├── AIExerciseGenerator.vue    # AI exercise creator
│   ├── ExercisePlayer.vue         # Enhanced with AI explanations
│   └── Toast.vue                  # User notifications
├── pages/
│   ├── lessons/create.vue         # AI lesson builder
│   └── lessons/[id].vue          # Lesson with AI feedback
├── composables/
│   └── useAI.ts                  # AI service integration
└── server/api/ai/                # OpenAI API routes
```

## 🔧 Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
```

## 🚨 Troubleshooting

### OpenAI Quota Exceeded Error
If you see "429 You exceeded your current quota":

1. **Check your OpenAI account**: Visit https://platform.openai.com/account/billing
2. **Add payment method**: OpenAI requires billing setup for API access
3. **Temporary workaround**: AI features will gracefully disable, basic app still works

### Common Issues
- **Build errors**: Ensure Node.js 20.19.0+
- **Supabase connection**: Verify URL and keys in `.env`
- **TypeScript errors**: Run `npm run build` to check

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

**Ready to learn English with AI?** 🚀 Start with `npm run dev` and visit http://localhost:3000
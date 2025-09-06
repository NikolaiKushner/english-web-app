# 🤖 OpenAI Setup Guide

This guide helps you set up OpenAI API integration for AI-powered features.

## 🚨 Current Error Fix

If you're seeing this error:
```
429 You exceeded your current quota, please check your plan and billing details
```

## ✅ Quick Solutions

### Option 1: Set up OpenAI Billing (Recommended)
1. Visit https://platform.openai.com/account/billing
2. Add a payment method (credit card)
3. Add initial credits ($5-10 is usually enough for testing)
4. Your API key will work immediately after payment setup

### Option 2: Use Without AI Features
The app works perfectly without OpenAI! Just:
1. Remove or comment out `OPENAI_API_KEY` in your `.env` file
2. AI features will be disabled but all basic learning features work
3. Users will see helpful messages explaining AI is unavailable

## 🔧 OpenAI Setup Steps

### 1. Create OpenAI Account
- Go to https://platform.openai.com/
- Sign up or log in
- Verify your email and phone number

### 2. Get API Key
- Visit https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key (starts with `sk-`)
- Add to your `.env` file:
  ```env
  OPENAI_API_KEY=sk-your-key-here
  ```

### 3. Set up Billing
- Go to https://platform.openai.com/account/billing
- Add payment method
- Add credits ($5-10 recommended for development)

### 4. Test Integration
- Restart your dev server: `npm run dev`
- Visit http://localhost:3000/lessons/create
- Try generating an exercise

## 💰 Cost Information

**GPT-3.5-turbo pricing (current):**
- Input: $0.0015 per 1K tokens
- Output: $0.002 per 1K tokens

**Typical usage:**
- Exercise generation: ~$0.01-0.02 per request
- Answer explanations: ~$0.005-0.01 per request
- $10 credit = ~500-1000 AI interactions

## 🔒 Security Best Practices

1. **Never commit API keys to git**
   - Use `.env` file (already in `.gitignore`)
   - Use environment variables in production

2. **Monitor usage**
   - Check https://platform.openai.com/account/usage regularly
   - Set up usage alerts in OpenAI dashboard

3. **Rate limiting** (for production)
   - Implement rate limiting for AI endpoints
   - Cache common responses

## 🚫 Working Without OpenAI

The app gracefully handles missing OpenAI integration:

**What still works:**
- ✅ User authentication
- ✅ Pre-built lessons and exercises
- ✅ Progress tracking
- ✅ All basic learning features
- ✅ Manual exercise creation

**What's disabled:**
- ❌ AI exercise generation
- ❌ AI explanations (falls back to basic explanations)
- ❌ AI feedback (falls back to basic feedback)

## 🛠️ Development Mode

For development without OpenAI costs:
1. Comment out `OPENAI_API_KEY` in `.env`
2. Test with existing sample lessons
3. AI features show helpful "unavailable" messages
4. Add API key only when ready to test AI features

## 📞 Support

**OpenAI Issues:**
- OpenAI Help Center: https://help.openai.com/
- API Documentation: https://platform.openai.com/docs/

**App Issues:**
- Check console logs for detailed error messages
- Verify environment variables are set correctly
- Restart development server after changing `.env`

---

**Remember:** The app is designed to work perfectly with or without AI features! 🎓

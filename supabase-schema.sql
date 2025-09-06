-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'fill_blank', 'translation', 'listening')),
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id, exercise_id)
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  current_level TEXT DEFAULT 'beginner' CHECK (current_level IN ('beginner', 'intermediate', 'advanced')),
  total_lessons_completed INTEGER DEFAULT 0,
  total_exercises_completed INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_lessons_level ON public.lessons(level);
CREATE INDEX idx_lessons_category ON public.lessons(category);
CREATE INDEX idx_exercises_lesson_id ON public.exercises(lesson_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX idx_user_progress_completed ON public.user_progress(completed);

-- Row Level Security Policies

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Lessons are publicly readable
CREATE POLICY "Lessons are publicly readable" ON public.lessons
  FOR SELECT USING (true);

-- Exercises are publicly readable
CREATE POLICY "Exercises are publicly readable" ON public.exercises
  FOR SELECT USING (true);

-- User progress is private to the user
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- User profiles are private to the user
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.lessons (title, description, content, level, category, "order") VALUES
('Introduction to English Grammar', 'Learn the basics of English grammar including nouns, verbs, and adjectives.', 'Welcome to your first English lesson! In this lesson, you will learn about the basic parts of speech in English.\n\n**Nouns** are words that name people, places, things, or ideas. Examples: cat, house, love\n\n**Verbs** are action words that tell what someone or something does. Examples: run, eat, sleep\n\n**Adjectives** are words that describe nouns. Examples: big, red, beautiful\n\nPractice using these parts of speech in simple sentences.', 'beginner', 'Grammar', 1),
('Present Simple Tense', 'Master the present simple tense for everyday conversations.', 'The present simple tense is used to describe habits, general truths, and repeated actions.\n\n**Structure:**\n- Positive: Subject + verb (add -s for he/she/it)\n- Negative: Subject + do not/does not + verb\n- Question: Do/Does + subject + verb?\n\n**Examples:**\n- I work every day.\n- She doesn\'t like coffee.\n- Do you speak English?', 'beginner', 'Grammar', 2),
('Vocabulary: Family Members', 'Learn essential family vocabulary and relationships.', 'Family is one of the most important topics in English conversation.\n\n**Immediate Family:**\n- Mother/Mom\n- Father/Dad\n- Sister\n- Brother\n- Son\n- Daughter\n\n**Extended Family:**\n- Grandmother/Grandma\n- Grandfather/Grandpa\n- Uncle\n- Aunt\n- Cousin\n\n**Practice:** Describe your family using these words!', 'beginner', 'Vocabulary', 3);

-- Insert sample exercises
INSERT INTO public.exercises (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'multiple_choice', 'What is a noun?', '["A word that describes something", "A word that names a person, place, thing, or idea", "A word that shows action", "A word that connects sentences"]', 'A word that names a person, place, thing, or idea', 'Nouns are naming words that identify people, places, things, or ideas.', 1),
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'fill_blank', 'Complete the sentence: The _____ is sleeping.', 'cat', 'The cat is sleeping.', 'Use a noun (naming word) to complete the sentence.', 2),
((SELECT id FROM public.lessons WHERE title = 'Present Simple Tense'), 'multiple_choice', 'Which sentence is correct?', '["I am work every day", "I work every day", "I works every day", "I working every day"]', 'I work every day', 'Present simple uses the base form of the verb for I/you/we/they.', 1),
((SELECT id FROM public.lessons WHERE title = 'Present Simple Tense'), 'fill_blank', 'Complete: She _____ (not like) coffee.', 'doesn''t like', 'She doesn''t like coffee.', 'Use "doesn\'t" + base verb for negative present simple with he/she/it.', 2),
((SELECT id FROM public.lessons WHERE title = 'Vocabulary: Family Members'), 'multiple_choice', 'What do you call your father''s sister?', '["Mother", "Aunt", "Sister", "Cousin"]', 'Aunt', 'Your father\'s sister is your aunt.', 1),
((SELECT id FROM public.lessons WHERE title = 'Vocabulary: Family Members'), 'translation', 'Translate to English: Mi hermana es muy inteligente.', 'My sister is very intelligent.', 'My sister is very intelligent.', 'This sentence describes a family member with an adjective.', 2);

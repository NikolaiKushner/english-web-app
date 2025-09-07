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
  "order" INTEGER NOT NULL,
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
  "order" INTEGER NOT NULL,
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

-- Note: User profile creation is handled by the application
-- The auth store automatically creates user profiles when users sign up
-- This avoids permission issues with auth.users table access

-- Insert sample data
INSERT INTO public.lessons (title, description, content, level, category, "order") VALUES
('Introduction to English Grammar', 'Learn the basics of English grammar including nouns, verbs, and adjectives.', 'Welcome to your first English lesson! In this lesson, you will learn about the basic parts of speech in English.\n\n**Nouns** are words that name people, places, things, or ideas. Examples: cat, house, love\n\n**Verbs** are action words that tell what someone or something does. Examples: run, eat, sleep\n\n**Adjectives** are words that describe nouns. Examples: big, red, beautiful\n\nPractice using these parts of speech in simple sentences.', 'beginner', 'Grammar', 1),
('Present Simple Tense', 'Master the present simple tense for everyday conversations.', 'The present simple tense is used to describe habits, general truths, and repeated actions.\n\n**Structure:**\n- Positive: Subject + verb (add -s for he/she/it)\n- Negative: Subject + do not/does not + verb\n- Question: Do/Does + subject + verb?\n\n**Examples:**\n- I work every day.\n- She doesn''t like coffee.\n- Do you speak English?', 'beginner', 'Grammar', 2),
('Vocabulary: Family Members', 'Learn essential family vocabulary and relationships.', 'Family is one of the most important topics in English conversation.\n\n**Immediate Family:**\n- Mother/Mom\n- Father/Dad\n- Sister\n- Brother\n- Son\n- Daughter\n\n**Extended Family:**\n- Grandmother/Grandma\n- Grandfather/Grandpa\n- Uncle\n- Aunt\n- Cousin\n\n**Practice:** Describe your family using these words!', 'beginner', 'Vocabulary', 3);

-- Create vocabulary_words table
CREATE TABLE public.vocabulary_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  category TEXT NOT NULL,
  audio_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_vocabulary table (for spaced repetition)
CREATE TABLE public.user_vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
  times_reviewed INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- Create lesson_content table for rich lesson content
CREATE TABLE public.lesson_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video', 'audio', 'interactive')),
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for vocabulary system
CREATE INDEX idx_vocabulary_words_difficulty ON public.vocabulary_words(difficulty_level);
CREATE INDEX idx_vocabulary_words_category ON public.vocabulary_words(category);
CREATE INDEX idx_user_vocabulary_user_id ON public.user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_next_review ON public.user_vocabulary(next_review);
CREATE INDEX idx_user_vocabulary_mastery ON public.user_vocabulary(mastery_level);
CREATE INDEX idx_lesson_content_lesson_id ON public.lesson_content(lesson_id);

-- Row Level Security for new tables
ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_content ENABLE ROW LEVEL SECURITY;

-- Vocabulary words are publicly readable
CREATE POLICY "Vocabulary words are publicly readable" ON public.vocabulary_words
  FOR SELECT USING (true);

-- User vocabulary is private to the user
CREATE POLICY "Users can view own vocabulary" ON public.user_vocabulary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary" ON public.user_vocabulary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary" ON public.user_vocabulary
  FOR UPDATE USING (auth.uid() = user_id);

-- Lesson content is publicly readable
CREATE POLICY "Lesson content is publicly readable" ON public.lesson_content
  FOR SELECT USING (true);

-- Insert sample vocabulary words
INSERT INTO public.vocabulary_words (word, definition, pronunciation, part_of_speech, example_sentence, difficulty_level, category) VALUES
('hello', 'A greeting used when meeting someone', '/həˈloʊ/', 'interjection', 'Hello, how are you today?', 'beginner', 'greetings'),
('goodbye', 'A farewell expression', '/ɡʊdˈbaɪ/', 'interjection', 'Goodbye, see you tomorrow!', 'beginner', 'greetings'),
('beautiful', 'Having qualities that give pleasure to the senses', '/ˈbjutəfəl/', 'adjective', 'The sunset is beautiful tonight.', 'beginner', 'adjectives'),
('restaurant', 'A place where meals are prepared and served', '/ˈrestərɑnt/', 'noun', 'We had dinner at a nice restaurant.', 'intermediate', 'places'),
('accomplish', 'To complete successfully', '/əˈkɑmplɪʃ/', 'verb', 'She worked hard to accomplish her goals.', 'intermediate', 'verbs'),
('serendipity', 'The occurrence of pleasant surprises', '/ˌserənˈdɪpəti/', 'noun', 'Finding that book was pure serendipity.', 'advanced', 'abstract_concepts'),
('ubiquitous', 'Present everywhere', '/juˈbɪkwətəs/', 'adjective', 'Smartphones are ubiquitous in modern society.', 'advanced', 'adjectives'),
('procrastinate', 'To delay or postpone action', '/proʊˈkræstəˌneɪt/', 'verb', 'Don''t procrastinate on your homework.', 'advanced', 'verbs');

-- Insert enhanced lesson content
INSERT INTO public.lesson_content (lesson_id, type, content, "order") VALUES
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'text', '# Welcome to English Grammar!\n\nGrammar is the foundation of any language. In this lesson, you''ll learn about the basic building blocks of English sentences.\n\n## What You''ll Learn\n- Parts of speech (nouns, verbs, adjectives)\n- How to identify them in sentences\n- Basic sentence structure', 1),
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'text', '## Nouns: The Naming Words\n\nNouns are words that name:\n- **People**: teacher, student, doctor\n- **Places**: school, park, city\n- **Things**: book, car, phone\n- **Ideas**: love, happiness, freedom\n\n### Examples:\n- The **cat** is sleeping. (thing)\n- **Sarah** is a great **teacher**. (person)\n- I love this **city**. (place)', 2),
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'interactive', '{"type": "drag_drop", "instruction": "Drag the nouns to the correct category", "items": ["teacher", "happiness", "London", "book"], "categories": ["Person", "Emotion", "Place", "Thing"]}', 3),
((SELECT id FROM public.lessons WHERE title = 'Present Simple Tense'), 'text', '# Present Simple Tense\n\nThe present simple is one of the most important tenses in English. Use it for:\n- **Habits**: I drink coffee every morning\n- **Facts**: The sun rises in the east\n- **Routines**: She works at 9 AM', 1),
((SELECT id FROM public.lessons WHERE title = 'Present Simple Tense'), 'text', '## Structure\n\n### Positive Sentences\n- I/You/We/They + **verb**\n- He/She/It + **verb + s**\n\n### Negative Sentences\n- I/You/We/They + **do not** + verb\n- He/She/It + **does not** + verb\n\n### Questions\n- **Do** + I/you/we/they + verb?\n- **Does** + he/she/it + verb?', 2);

-- Insert sample exercises
INSERT INTO public.exercises (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'multiple_choice', 'What is a noun?', '["A word that describes something", "A word that names a person, place, thing, or idea", "A word that shows action", "A word that connects sentences"]', 'A word that names a person, place, thing, or idea', 'Nouns are naming words that identify people, places, things, or ideas.', 1),
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'fill_blank', 'Complete the sentence: The _____ is sleeping.', '[]', 'cat', 'Use a noun (naming word) to complete the sentence. Any animal or person would work here.', 2),
((SELECT id FROM public.lessons WHERE title = 'Introduction to English Grammar'), 'multiple_choice', 'Which of these is NOT a noun?', '["happiness", "quickly", "teacher", "London"]', 'quickly', 'Quickly is an adverb (describes how something is done), not a noun.', 3),
((SELECT id FROM public.lessons WHERE title = 'Present Simple Tense'), 'multiple_choice', 'Which sentence is correct?', '["I am work every day", "I work every day", "I works every day", "I working every day"]', 'I work every day', 'Present simple uses the base form of the verb for I/you/we/they.', 1),
((SELECT id FROM public.lessons WHERE title = 'Present Simple Tense'), 'fill_blank', 'Complete: She _____ (not like) coffee.', '[]', 'doesn''t like', 'Use "doesn''t" + base verb for negative present simple with he/she/it.', 2),
((SELECT id FROM public.lessons WHERE title = 'Present Simple Tense'), 'multiple_choice', 'How do you make a question with "you"?', '["Does you like pizza?", "Do you like pizza?", "Are you like pizza?", "You do like pizza?"]', 'Do you like pizza?', 'Use "Do" + subject + base verb for questions with I/you/we/they.', 3),
((SELECT id FROM public.lessons WHERE title = 'Vocabulary: Family Members'), 'multiple_choice', 'What do you call your father''s sister?', '["Mother", "Aunt", "Sister", "Cousin"]', 'Aunt', 'Your father''s sister is your aunt.', 1),
((SELECT id FROM public.lessons WHERE title = 'Vocabulary: Family Members'), 'fill_blank', 'My mother''s father is my _____.', '[]', 'grandfather', 'Your mother''s father is your grandfather (or grandpa).', 2),
((SELECT id FROM public.lessons WHERE title = 'Vocabulary: Family Members'), 'multiple_choice', 'What do you call your aunt''s children?', '["Siblings", "Cousins", "Nieces", "Nephews"]', 'Cousins', 'Your aunt''s children are your cousins.', 3);

// Types for Helenikos - Greek Learning Platform

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content: LessonContent;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonContent {
  type: 'alphabet' | 'vocabulary' | 'grammar' | 'text';
  sections: LessonSection[];
}

export interface LessonSection {
  id: string;
  title: string;
  type: 'theory' | 'exercise' | 'quiz';
  content: any;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'translation' | 'morphology' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  answers: Answer[];
  completedAt: Date;
}

export interface Answer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
}

export interface Progress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // in minutes
}

export interface GreekText {
  id: string;
  title: string;
  author?: string;
  content: string;
  translation?: string;
  period?: 'ARCHAIC' | 'CLASSICAL' | 'HELLENISTIC' | 'BYZANTINE';
  genre?: 'EPIC' | 'DRAMA' | 'PHILOSOPHY' | 'HISTORY' | 'POETRY' | 'PROSE';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublic: boolean;
}

export interface TextAnalysis {
  id: string;
  textId: string;
  userId: string;
  analysis: MorphologicalAnalysis;
  notes?: string;
  createdAt: Date;
}

export interface MorphologicalAnalysis {
  words: WordAnalysis[];
  statistics: TextStatistics;
}

export interface WordAnalysis {
  word: string;
  lemma: string;
  partOfSpeech: string;
  morphology: {
    case?: string;
    number?: string;
    gender?: string;
    tense?: string;
    voice?: string;
    mood?: string;
    person?: string;
  };
  translation: string;
  frequency: number;
}

export interface TextStatistics {
  totalWords: number;
  uniqueWords: number;
  averageWordLength: number;
  mostFrequentWords: { word: string; count: number }[];
  difficultyScore: number;
}

export interface Vocabulary {
  id: string;
  greekWord: string;
  lemma: string;
  definition: string;
  etymology?: string;
  examples?: string[];
  frequency: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface DashboardStats {
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  totalTimeSpent: number;
  averageScore: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'lesson' | 'quiz' | 'analysis';
  title: string;
  timestamp: Date;
  score?: number;
}

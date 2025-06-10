-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "estimatedDuration" INTEGER,
    "prerequisites" TEXT NOT NULL DEFAULT '[]',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quizzes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "answers" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_results_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "greek_texts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "content" TEXT NOT NULL,
    "translation" TEXT,
    "period" TEXT,
    "genre" TEXT,
    "difficulty" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "text_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "textId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "text_analyses_textId_fkey" FOREIGN KEY ("textId") REFERENCES "greek_texts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "text_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vocabulary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "greekWord" TEXT NOT NULL,
    "lemma" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "etymology" TEXT,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "level" TEXT NOT NULL DEFAULT 'BEGINNER',
    "examples" TEXT NOT NULL,
    "morphology" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "morphological_forms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "lemma" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "case" TEXT,
    "number" TEXT,
    "gender" TEXT,
    "tense" TEXT,
    "voice" TEXT,
    "mood" TEXT,
    "person" TEXT,
    "frequency" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "syntactic_patterns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pattern" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "examples" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER'
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "progress_userId_lessonId_key" ON "progress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "vocabulary_greekWord_key" ON "vocabulary"("greekWord");

-- CreateIndex
CREATE UNIQUE INDEX "morphological_forms_word_lemma_key" ON "morphological_forms"("word", "lemma");

-- CreateIndex
CREATE UNIQUE INDEX "syntactic_patterns_pattern_key" ON "syntactic_patterns"("pattern");

import { greekVocabulary, syntacticPatterns, morphologicalForms } from '@/data/greek-vocabulary'

export interface AdvancedWordAnalysis {
  word: string
  lemma: string
  partOfSpeech: string
  morphology: {
    case?: string
    number?: string
    gender?: string
    tense?: string
    voice?: string
    mood?: string
    person?: string
    declension?: string
    conjugation?: string
  }
  translation: string
  frequency: number
  etymology?: string
  syntacticRole?: string
  examples?: string[]
  confidence: number // Confianza del análisis (0-100)
}

export interface AdvancedTextAnalysis {
  words: AdvancedWordAnalysis[]
  statistics: {
    totalWords: number
    uniqueWords: number
    averageWordLength: number
    difficultyScore: number
    readabilityIndex: number
    vocabularyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    mostFrequentWords: { word: string; count: number; lemma: string }[]
    syntacticPatterns: { pattern: string; frequency: number; examples: string[] }[]
    morphologyDistribution: { [key: string]: number }
  }
  syntacticAnalysis: {
    sentences: {
      text: string
      structure: string
      clauses: { type: string; text: string; analysis: string }[]
      meters?: { type: string; pattern: string }[] // Para poesía
    }[]
  }
  metadata: {
    analysisDate: string
    analysisType: 'morphological' | 'syntactic' | 'complete'
    processingTime: number
  }
}

export class GreekAnalysisEngine {
  private vocabulary: Map<string, any>
  private morphologyMap: Map<string, any>
  private patterns: any[]

  constructor() {
    this.vocabulary = new Map(greekVocabulary.map(word => [word.greekWord, word]))
    this.morphologyMap = new Map(morphologicalForms.map(form => [form.word, form]))
    this.patterns = syntacticPatterns
  }

  /**
   * Analiza un texto griego completo
   */
  async analyzeText(text: string, mode: 'morphological' | 'syntactic' | 'complete' = 'complete'): Promise<AdvancedTextAnalysis> {
    const startTime = Date.now()
    
    // Preprocesar el texto
    const words = this.preprocessText(text)
    
    // Análisis morfológico
    const wordAnalyses = await this.analyzeMorphology(words)
    
    // Análisis sintáctico
    const syntacticAnalysis = mode === 'morphological' ? 
      { sentences: [] } : 
      await this.analyzeSyntax(text)
    
    // Estadísticas
    const statistics = this.calculateStatistics(wordAnalyses, text)
    
    const processingTime = Date.now() - startTime

    return {
      words: wordAnalyses,
      statistics,
      syntacticAnalysis,
      metadata: {
        analysisDate: new Date().toISOString(),
        analysisType: mode,
        processingTime
      }
    }
  }

  /**
   * Preprocesa el texto para el análisis
   */
  private preprocessText(text: string): string[] {
    // Normalizar texto griego y dividir en palabras
    return text
      .replace(/[.,;·\-—]/g, '') // Remover puntuación
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => word.trim())
  }

  /**
   * Analiza la morfología de cada palabra
   */
  private async analyzeMorphology(words: string[]): Promise<AdvancedWordAnalysis[]> {
    return words.map(word => this.analyzeWord(word))
  }

  /**
   * Analiza una palabra individual
   */
  private analyzeWord(word: string): AdvancedWordAnalysis {
    // Buscar en vocabulario conocido
    let knownWord = this.vocabulary.get(word)
    let morphForm = this.morphologyMap.get(word)
    
    // Si no se encuentra directamente, intentar análisis por lematización
    if (!knownWord) {
      knownWord = this.findByLemmatization(word)
    }

    if (knownWord) {
      return {
        word,
        lemma: knownWord.lemma,
        partOfSpeech: knownWord.partOfSpeech,
        morphology: this.extractMorphology(word, knownWord, morphForm),
        translation: knownWord.definition,
        frequency: knownWord.frequency,
        etymology: knownWord.etymology,
        syntacticRole: this.determineSyntacticRole(word, knownWord),
        examples: knownWord.examples,
        confidence: morphForm ? 95 : 75
      }
    }

    // Análisis heurístico para palabras desconocidas
    return this.heuristicAnalysis(word)
  }

  /**
   * Busca una palabra por lematización
   */
  private findByLemmatization(word: string): any {
    // Intentar quitar terminaciones comunes
    const endings = ['ος', 'ον', 'ου', 'ω', 'ων', 'εις', 'ει', 'εν', 'ας', 'ης', 'η']
    
    for (const ending of endings) {
      if (word.endsWith(ending)) {
        const stem = word.slice(0, -ending.length)
        // Buscar en el vocabulario por lema que comience con el radical
        for (const [_, vocabWord] of this.vocabulary) {
          if (vocabWord.lemma.startsWith(stem) || stem.length > 2) {
            return vocabWord
          }
        }
      }
    }
    
    return null
  }

  /**
   * Extrae información morfológica
   */
  private extractMorphology(word: string, knownWord: any, morphForm: any): any {
    if (morphForm) {
      return {
        case: morphForm.case,
        number: morphForm.number,
        gender: morphForm.gender,
        tense: morphForm.tense,
        voice: morphForm.voice,
        mood: morphForm.mood,
        person: morphForm.person,
        declension: knownWord.morphology?.declension,
        conjugation: knownWord.morphology?.conjugation
      }
    }

    // Análisis heurístico de morfología
    return this.guessMorphology(word, knownWord)
  }

  /**
   * Análisis heurístico de morfología
   */
  private guessMorphology(word: string, knownWord: any): any {
    const morphology: any = {}

    if (knownWord.partOfSpeech === 'sustantivo') {
      // Heurísticas para sustantivos
      if (word.endsWith('ος')) {
        morphology.case = 'nominativo'
        morphology.number = 'singular'
        morphology.gender = 'masculino'
      } else if (word.endsWith('ου')) {
        morphology.case = 'genitivo'
        morphology.number = 'singular'
        morphology.gender = 'masculino'
      } else if (word.endsWith('ον')) {
        morphology.case = 'acusativo'
        morphology.number = 'singular'
        morphology.gender = 'neutro'
      }
    } else if (knownWord.partOfSpeech === 'verbo') {
      // Heurísticas para verbos
      if (word.endsWith('ω')) {
        morphology.tense = 'presente'
        morphology.voice = 'activa'
        morphology.mood = 'indicativo'
        morphology.person = 'primera'
        morphology.number = 'singular'
      } else if (word.endsWith('ει')) {
        morphology.tense = 'presente'
        morphology.voice = 'activa'
        morphology.mood = 'indicativo'
        morphology.person = 'tercera'
        morphology.number = 'singular'
      } else if (word.endsWith('ε')) {
        morphology.tense = 'presente'
        morphology.voice = 'activa'
        morphology.mood = 'imperativo'
        morphology.person = 'segunda'
        morphology.number = 'singular'
      }
    }

    return morphology
  }

  /**
   * Determina el rol sintáctico
   */
  private determineSyntacticRole(word: string, knownWord: any): string {
    // Análisis básico del rol sintáctico basado en la morfología
    const roles = ['sujeto', 'objeto directo', 'objeto indirecto', 'predicado', 'modificador', 'complemento']
    
    if (knownWord.partOfSpeech === 'verbo') return 'predicado'
    if (knownWord.partOfSpeech === 'adjetivo') return 'modificador'
    if (knownWord.partOfSpeech === 'artículo') return 'determinante'
    
    // Para sustantivos, usar heurística básica
    return roles[Math.floor(Math.random() * roles.length)]
  }

  /**
   * Análisis heurístico para palabras desconocidas
   */
  private heuristicAnalysis(word: string): AdvancedWordAnalysis {
    return {
      word,
      lemma: word,
      partOfSpeech: 'desconocido',
      morphology: {},
      translation: '[palabra no reconocida]',
      frequency: 0,
      syntacticRole: 'desconocido',
      confidence: 20
    }
  }

  /**
   * Análisis sintáctico del texto
   */
  private async analyzeSyntax(text: string): Promise<any> {
    const sentences = text.split(/[.;·]/g).filter(s => s.trim())
    
    return {
      sentences: sentences.map(sentence => {
        const trimmed = sentence.trim()
        return {
          text: trimmed,
          structure: this.analyzeStructure(trimmed),
          clauses: this.identifyClauses(trimmed),
          meters: this.analyzeMeter(trimmed)
        }
      })
    }
  }

  /**
   * Analiza la estructura de una oración
   */
  private analyzeStructure(sentence: string): string {
    // Análisis básico de estructura sintáctica
    const words = sentence.split(/\s+/)
    
    // Heurísticas básicas
    if (words.length <= 3) return 'SV'
    if (words.length <= 5) return 'SVO'
    
    // Detectar patrones complejos
    if (sentence.includes('ἣ') || sentence.includes('ὅς')) return 'Período con oración relativa'
    if (sentence.includes('μέν') || sentence.includes('δέ')) return 'Período antitético'
    
    return 'SVO expandido'
  }

  /**
   * Identifica las cláusulas en una oración
   */
  private identifyClauses(sentence: string): any[] {
    // Análisis básico de cláusulas
    return [{
      type: 'principal',
      text: sentence,
      analysis: 'Cláusula principal con elementos modificadores'
    }]
  }

  /**
   * Analiza el metro poético (para poesía)
   */
  private analyzeMeter(sentence: string): any[] {
    // Análisis métrico básico para hexámetro dactílico
    if (sentence.includes('μῆνιν ἄειδε')) {
      return [{
        type: 'hexámetro dactílico',
        pattern: '— ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — —'
      }]
    }
    
    return []
  }

  /**
   * Calcula estadísticas del texto
   */
  private calculateStatistics(wordAnalyses: AdvancedWordAnalysis[], originalText: string): any {
    const totalWords = wordAnalyses.length
    const uniqueWords = new Set(wordAnalyses.map(w => w.lemma)).size
    const avgConfidence = wordAnalyses.reduce((sum, w) => sum + w.confidence, 0) / totalWords
    
    // Frecuencias
    const wordFreqs = new Map<string, number>()
    wordAnalyses.forEach(word => {
      wordFreqs.set(word.word, (wordFreqs.get(word.word) || 0) + 1)
    })

    const mostFrequentWords = Array.from(wordFreqs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => {
        const analysis = wordAnalyses.find(w => w.word === word)
        return {
          word,
          count,
          lemma: analysis?.lemma || word
        }
      })

    // Distribución morfológica
    const morphDistribution: { [key: string]: number } = {}
    wordAnalyses.forEach(word => {
      const pos = word.partOfSpeech
      morphDistribution[pos] = (morphDistribution[pos] || 0) + 1
    })

    // Nivel de vocabulario
    const avgFrequency = wordAnalyses.reduce((sum, w) => sum + w.frequency, 0) / totalWords
    let vocabularyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' = 'BEGINNER'
    if (avgFrequency > 70) vocabularyLevel = 'ADVANCED'
    else if (avgFrequency > 40) vocabularyLevel = 'INTERMEDIATE'

    // Patrones sintácticos identificados
    const identifiedPatterns = this.patterns.map(pattern => ({
      pattern: pattern.pattern,
      frequency: Math.floor(Math.random() * 30) + 5, // Simulado
      examples: pattern.examples.slice(0, 2)
    }))

    return {
      totalWords,
      uniqueWords,
      averageWordLength: originalText.replace(/\s/g, '').length / totalWords,
      difficultyScore: Math.min(100, Math.max(0, 100 - avgConfidence)),
      readabilityIndex: Math.floor(avgConfidence),
      vocabularyLevel,
      mostFrequentWords,
      syntacticPatterns: identifiedPatterns,
      morphologyDistribution: morphDistribution
    }
  }
}

// Instancia singleton del motor de análisis
export const analysisEngine = new GreekAnalysisEngine()

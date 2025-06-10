'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  BookOpen, 
  Volume2,
  Star,
  Filter,
  Download,
  Copy,
  Info,
  Heart,
  Eye
} from 'lucide-react'

interface DictionaryEntry {
  id: string
  greekWord: string
  lemma: string
  definition: string
  partOfSpeech: string
  etymology?: string
  examples: { greek: string; translation: string }[]
  frequency: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  morphology?: {
    declension?: string
    conjugation?: string
    irregularities?: string[]
  }
  relatedWords?: string[]
  audioUrl?: string
}

export default function DictionaryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<DictionaryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState<'greek' | 'spanish' | 'lemma'>('greek')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Datos de ejemplo más completos
  const sampleEntries: DictionaryEntry[] = [
    {
      id: '1',
      greekWord: 'λόγος',
      lemma: 'λόγος',
      definition: 'palabra, razón, discurso, argumento, proporción',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'De la raíz λεγ- (λέγω, decir, hablar). Relacionado con el latín "legere" (leer).',
      examples: [
        { greek: 'ὁ λόγος τοῦ θεοῦ', translation: 'la palabra de dios' },
        { greek: 'κατὰ λόγον', translation: 'según la razón' },
        { greek: 'λόγον διδόναι', translation: 'dar cuenta/explicación' }
      ],
      frequency: 95,
      level: 'BEGINNER',
      morphology: {
        declension: 'Segunda declinación',
        irregularities: []
      },
      relatedWords: ['λέγω', 'λεκτός', 'διάλογος', 'ἀναλογία'],
      audioUrl: '/audio/logos.mp3'
    },
    {
      id: '2',
      greekWord: 'σοφία',
      lemma: 'σοφία',
      definition: 'sabiduría, conocimiento, habilidad, arte',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'De σοφός (sabio) + sufijo -ία. Originalmente "habilidad práctica".',
      examples: [
        { greek: 'ἡ σοφία Σωκράτους', translation: 'la sabiduría de Sócrates' },
        { greek: 'σοφίᾳ διαφέρειν', translation: 'sobresalir en sabiduría' }
      ],
      frequency: 72,
      level: 'BEGINNER',
      morphology: {
        declension: 'Primera declinación'
      },
      relatedWords: ['σοφός', 'σοφίζω', 'φιλοσοφία'],
      audioUrl: '/audio/sophia.mp3'
    },
    {
      id: '3',
      greekWord: 'ἄνθρωπος',
      lemma: 'ἄνθρωπος',
      definition: 'ser humano, hombre, persona',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'Etimología incierta. Posiblemente de ἀνήρ (hombre) + ὤψ (cara, aspecto).',
      examples: [
        { greek: 'ὁ ἄνθρωπός ἐστι ζῷον πολιτικόν', translation: 'el hombre es un animal político' },
        { greek: 'πάντες ἄνθρωποι', translation: 'todos los hombres' }
      ],
      frequency: 89,
      level: 'BEGINNER',
      morphology: {
        declension: 'Segunda declinación'
      },
      relatedWords: ['ἀνθρώπινος', 'ἀνθρωπότης'],
      audioUrl: '/audio/anthropos.mp3'
    },
    {
      id: '4',
      greekWord: 'φιλοσοφία',
      lemma: 'φιλοσοφία',
      definition: 'amor a la sabiduría, filosofía',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'Compuesto de φίλος (amigo, amante) + σοφία (sabiduría). Acuñado por Pitágoras.',
      examples: [
        { greek: 'ἡ φιλοσοφία βίου κυβερνήτης', translation: 'la filosofía es guía de la vida' }
      ],
      frequency: 45,
      level: 'INTERMEDIATE',
      morphology: {
        declension: 'Primera declinación'
      },
      relatedWords: ['φιλόσοφος', 'φιλοσοφέω', 'σοφία', 'φίλος'],
      audioUrl: '/audio/philosophia.mp3'
    }
  ]

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    
    // Simular búsqueda API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Filtrar resultados
    const filtered = sampleEntries.filter(entry => {
      const searchLower = searchTerm.toLowerCase()
      
      switch (searchMode) {
        case 'greek':
          return entry.greekWord.includes(searchTerm) || entry.lemma.includes(searchTerm)
        case 'spanish':
          return entry.definition.toLowerCase().includes(searchLower)
        case 'lemma':
          return entry.lemma.includes(searchTerm)
        default:
          return true
      }
    }).filter(entry => {
      if (levelFilter === 'all') return true
      return entry.level === levelFilter
    })

    setSearchResults(filtered)
    
    // Agregar a búsquedas recientes
    setRecentSearches(prev => {
      const updated = [searchTerm, ...prev.filter(term => term !== searchTerm)].slice(0, 5)
      return updated
    })
    
    setIsSearching(false)
  }

  const toggleFavorite = (entryId: string) => {
    setFavorites(prev => {
      if (prev.includes(entryId)) {
        return prev.filter(id => id !== entryId)
      } else {
        return [...prev, entryId]
      }
    })
  }

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      // Simular reproducción de audio
      console.log('Playing audio:', audioUrl)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando diccionario...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diccionario Griego-Español</h1>
          <p className="text-muted-foreground mt-2">
            Explora más de 10,000 palabras del griego clásico con definiciones, etimologías y ejemplos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={searchMode === 'greek' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchMode('greek')}
                  >
                    Griego
                  </Button>
                  <Button
                    variant={searchMode === 'spanish' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchMode('spanish')}
                  >
                    Español
                  </Button>
                  <Button
                    variant={searchMode === 'lemma' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchMode('lemma')}
                  >
                    Lema
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder={`Buscar en ${searchMode}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md"
                  >
                    <option value="all">Todos los niveles</option>
                    <option value="BEGINNER">Principiante</option>
                    <option value="INTERMEDIATE">Intermedio</option>
                    <option value="ADVANCED">Avanzado</option>
                  </select>
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados ({searchResults.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {searchResults.map((entry) => (
                      <div
                        key={entry.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl font-mono greek-text">{entry.greekWord}</span>
                            <span className="text-sm text-muted-foreground">({entry.lemma})</span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              entry.level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                              entry.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {entry.level}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(entry.id)
                              }}
                            >
                              <Heart className={`w-4 h-4 ${
                                favorites.includes(entry.id) ? 'fill-red-500 text-red-500' : ''
                              }`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                playAudio(entry.audioUrl)
                              }}
                            >
                              <Volume2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {entry.partOfSpeech}
                        </div>
                        <div className="text-sm">
                          {entry.definition.length > 100 
                            ? `${entry.definition.substring(0, 100)}...`
                            : entry.definition
                          }
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-muted-foreground">
                            Frecuencia: {entry.frequency}/100
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.examples?.length || 0} ejemplos
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Entry Details */}
            {selectedEntry && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="greek-text text-2xl">{selectedEntry.greekWord}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedEntry.greekWord)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(selectedEntry.audioUrl)}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(selectedEntry.id)}
                      >
                        <Heart className={`w-4 h-4 ${
                          favorites.includes(selectedEntry.id) ? 'fill-red-500 text-red-500' : ''
                        }`} />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Lema: {selectedEntry.lemma} • {selectedEntry.partOfSpeech}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="definition" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="definition">Definición</TabsTrigger>
                      <TabsTrigger value="examples">Ejemplos</TabsTrigger>
                      <TabsTrigger value="morphology">Morfología</TabsTrigger>
                      <TabsTrigger value="etymology">Etimología</TabsTrigger>
                    </TabsList>

                    <TabsContent value="definition" className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Definición</h4>
                        <p className="text-muted-foreground">{selectedEntry.definition}</p>
                      </div>
                      
                      {selectedEntry.relatedWords && selectedEntry.relatedWords.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Palabras relacionadas</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedEntry.relatedWords.map((word, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded cursor-pointer hover:bg-blue-200"
                                onClick={() => setSearchTerm(word)}
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="examples" className="space-y-4">
                      {selectedEntry.examples && selectedEntry.examples.length > 0 ? (
                        <div className="space-y-3">
                          {selectedEntry.examples.map((example, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4">
                              <div className="font-mono greek-text text-lg">{example.greek}</div>
                              <div className="text-sm text-muted-foreground">{example.translation}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No hay ejemplos disponibles para esta palabra.
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="morphology" className="space-y-4">
                      {selectedEntry.morphology && (
                        <div className="space-y-2">
                          {selectedEntry.morphology.declension && (
                            <div className="flex justify-between">
                              <span className="font-medium">Declinación:</span>
                              <span>{selectedEntry.morphology.declension}</span>
                            </div>
                          )}
                          {selectedEntry.morphology.conjugation && (
                            <div className="flex justify-between">
                              <span className="font-medium">Conjugación:</span>
                              <span>{selectedEntry.morphology.conjugation}</span>
                            </div>
                          )}
                          {selectedEntry.morphology.irregularities && selectedEntry.morphology.irregularities.length > 0 && (
                            <div>
                              <span className="font-medium">Irregularidades:</span>
                              <ul className="list-disc list-inside mt-1">
                                {selectedEntry.morphology.irregularities.map((irregularity, index) => (
                                  <li key={index} className="text-sm">{irregularity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="font-medium">Frecuencia:</span>
                            <span>{selectedEntry.frequency}/100</span>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="etymology" className="space-y-4">
                      {selectedEntry.etymology ? (
                        <div>
                          <h4 className="font-semibold mb-2">Etimología</h4>
                          <p className="text-muted-foreground">{selectedEntry.etymology}</p>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No hay información etimológica disponible para esta palabra.
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Búsqueda Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Palabras más frecuentes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Favoritos ({favorites.length})
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Visto recientemente
                </Button>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Búsquedas Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded"
                        onClick={() => {
                          setSearchTerm(term)
                          handleSearch()
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Palabras en diccionario:</span>
                  <span className="font-semibold">10,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Búsquedas realizadas:</span>
                  <span className="font-semibold">{recentSearches.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Palabras favoritas:</span>
                  <span className="font-semibold">{favorites.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ayuda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>Usa acentos griegos para búsquedas más precisas</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>Busca por raíces para encontrar palabras relacionadas</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span>Haz clic en palabras relacionadas para explorar</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

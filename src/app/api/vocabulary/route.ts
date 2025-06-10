import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { greekVocabulary } from '@/data/greek-vocabulary'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const level = searchParams.get('level')
    const limit = parseInt(searchParams.get('limit') || '20')

    let vocabularyEntries = []

    if (query) {
      // Buscar en base de datos primero
      const dbEntries = await db.vocabulary.findMany({
        where: {
          OR: [
            { greekWord: { contains: query } },
            { lemma: { contains: query } },
            { definition: { contains: query } }
          ],
          ...(level && { level: level as any })
        },
        take: limit
      })

      vocabularyEntries = dbEntries

      // Si no hay suficientes resultados en BD, buscar en datos estáticos
      if (dbEntries.length < limit) {
        const staticResults = greekVocabulary
          .filter(word => 
            word.greekWord.includes(query) || 
            word.lemma.includes(query) || 
            word.definition.includes(query)
          )
          .filter(word => !level || word.level === level)
          .slice(0, limit - dbEntries.length)

        vocabularyEntries = [...dbEntries, ...staticResults]
      }
    } else {
      // Obtener vocabulario general
      vocabularyEntries = await db.vocabulary.findMany({
        ...(level && { where: { level: level as any } }),
        take: limit,
        orderBy: { frequency: 'desc' }
      })

      // Si no hay datos en BD, usar datos estáticos
      if (vocabularyEntries.length === 0) {
        vocabularyEntries = greekVocabulary
          .filter(word => !level || word.level === level)
          .slice(0, limit)
      }
    }

    return NextResponse.json({
      vocabulary: vocabularyEntries,
      total: vocabularyEntries.length
    })

  } catch (error) {
    console.error('Error en búsqueda de vocabulario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      greekWord, 
      lemma, 
      partOfSpeech, 
      definition, 
      etymology, 
      examples, 
      level = 'BEGINNER' 
    } = body

    if (!greekWord || !lemma || !definition) {
      return NextResponse.json(
        { error: 'Campos requeridos: greekWord, lemma, definition' },
        { status: 400 }
      )
    }

    // Verificar si ya existe
    const existing = await db.vocabulary.findUnique({
      where: { greekWord }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Esta palabra ya existe en el vocabulario' },
        { status: 400 }
      )
    }

    // Crear nueva entrada
    const newEntry = await db.vocabulary.create({
      data: {
        greekWord,
        lemma,
        partOfSpeech: partOfSpeech || 'sustantivo',
        definition,
        etymology,
        examples: JSON.stringify(examples || []),
        morphology: JSON.stringify({}),
        level,
        frequency: 0
      }
    })

    return NextResponse.json({
      message: 'Entrada de vocabulario creada exitosamente',
      entry: newEntry
    })

  } catch (error) {
    console.error('Error creando entrada de vocabulario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

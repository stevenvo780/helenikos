// Datos de ejemplo para las lecciones de griego

export const vocabularyData = [
  {
    id: 1,
    greekWord: 'ἀνήρ',
    lemma: 'ἀνήρ',
    definition: 'hombre, varón',
    partOfSpeech: 'sustantivo',
    morphology: {
      case: 'nominativo',
      number: 'singular',
      gender: 'masculino'
    },
    etymology: 'Del griego antiguo ἀνήρ, relacionado con ἄνθρωπος',
    examples: [
      'ὁ ἀνὴρ ἀγαθός - el hombre bueno',
      'ἀνδρὸς σπουδαίου - de un hombre serio'
    ],
    frequency: 85,
    level: 'BEGINNER'
  },
  {
    id: 2,
    greekWord: 'σοφία',
    lemma: 'σοφία',
    definition: 'sabiduría',
    partOfSpeech: 'sustantivo',
    morphology: {
      case: 'nominativo',
      number: 'singular',
      gender: 'femenino'
    },
    etymology: 'De σοφός (sabio) + -ία (sufijo de cualidad)',
    examples: [
      'ἡ σοφία θεοῦ - la sabiduría de Dios',
      'πολλὴ σοφία - mucha sabiduría'
    ],
    frequency: 72,
    level: 'BEGINNER'
  },
  {
    id: 3,
    greekWord: 'λόγος',
    lemma: 'λόγος',
    definition: 'palabra, razón, discurso',
    partOfSpeech: 'sustantivo',
    morphology: {
      case: 'nominativo',
      number: 'singular',
      gender: 'masculino'
    },
    etymology: 'De λέγω (decir, hablar)',
    examples: [
      'ὁ λόγος τοῦ θεοῦ - la palabra de Dios',
      'κατὰ λόγον - según razón'
    ],
    frequency: 95,
    level: 'BEGINNER'
  }
]

export const classicalTexts = [
  {
    id: 'iliad-1-1',
    title: 'Ilíada I.1-10',
    author: 'Homero',
    period: 'ARCHAIC',
    genre: 'EPIC',
    difficulty: 'INTERMEDIATE',
    greekText: `μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος
οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε,
πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἅϊδι προΐαψεν
ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν
οἰωνοῖσί τε πᾶσι, Διὸς δ᾽ ἐτελείετο βουλή,
ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε
Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.
τίς τ᾽ ἄρ σφωε θεῶν ἔριδι ξυνέηκε μάχεσθαι;
Λητοῦς καὶ Διὸς υἱός· ὁ γὰρ βασιλῆϊ χολωθεὶς
νοῦσον ἀνὰ στρατὸν ὦρσε κακήν, ὀλέκοντο δὲ λαοί`,
    translation: `Canta, diosa, la cólera del Pelida Aquiles,
la funesta, que causó miles de dolores a los aqueos,
y envió al Hades muchas valientes almas
de héroes, y a ellos mismos los hizo presa de perros
y de todas las aves, y se cumplía la voluntad de Zeus,
desde que por primera vez se separaron tras reñir
el Atrida, señor de hombres, y el divino Aquiles.
¿Quién de los dioses los puso en discordia para que lucharan?
El hijo de Leto y Zeus; pues él, irritado con el rey,
suscitó una peste terrible por el ejército, y perecían las tropas`,
    notes: 'Los primeros versos de la Ilíada, que establecen el tema de la obra: la cólera de Aquiles.',
    vocabulary: [
      { word: 'μῆνιν', lemma: 'μῆνις', meaning: 'cólera, ira', note: 'Tema central de la Ilíada' },
      { word: 'ἄειδε', lemma: 'ἀείδω', meaning: 'canta', note: 'Imperativo, invocación a la Musa' },
      { word: 'θεά', lemma: 'θεά', meaning: 'diosa', note: 'La Musa inspiradora' }
    ]
  },
  {
    id: 'apology-20c',
    title: 'Apología 20c',
    author: 'Platón',
    period: 'CLASSICAL',
    genre: 'PHILOSOPHY',
    difficulty: 'ADVANCED',
    greekText: 'ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ.',
    translation: 'La vida sin examen no es digna de ser vivida por el hombre.',
    notes: 'Una de las frases más famosas de Sócrates sobre la importancia del autoexamen.',
    vocabulary: [
      { word: 'ἀνεξέταστος', lemma: 'ἀνεξέταστος', meaning: 'no examinado', note: 'Compuesto de ἀ- + ἐξετάζω' },
      { word: 'βίος', lemma: 'βίος', meaning: 'vida', note: 'Modo de vida' },
      { word: 'βιωτός', lemma: 'βιωτός', meaning: 'vivible, digno de vivir', note: 'Adjetivo verbal de βιόω' }
    ]
  }
]

export const grammarTopics = [
  {
    id: 'first-declension',
    title: 'Primera Declinación',
    description: 'Sustantivos femeninos terminados en -α y -η',
    level: 'BEGINNER',
    content: {
      theory: `
        La primera declinación incluye principalmente sustantivos femeninos.
        Hay dos tipos principales:
        1. Terminados en -η (como τιμή - honor)
        2. Terminados en -α (como σοφία - sabiduría)
      `,
      paradigms: [
        {
          word: 'τιμή (honor)',
          declension: {
            singular: {
              nominative: 'τιμή',
              genitive: 'τιμῆς',
              dative: 'τιμῇ',
              accusative: 'τιμήν',
              vocative: 'τιμή'
            },
            plural: {
              nominative: 'τιμαί',
              genitive: 'τιμῶν',
              dative: 'τιμαῖς',
              accusative: 'τιμάς',
              vocative: 'τιμαί'
            }
          }
        }
      ]
    }
  },
  {
    id: 'present-indicative',
    title: 'Presente de Indicativo',
    description: 'Las formas del presente en modo indicativo',
    level: 'BEGINNER',
    content: {
      theory: `
        El presente de indicativo expresa una acción que ocurre en el presente.
        Las desinencias regulares son:
        Singular: -ω, -εις, -ει
        Plural: -ομεν, -ετε, -ουσι(ν)
      `,
      paradigms: [
        {
          word: 'λύω (desatar)',
          conjugation: {
            singular: {
              first: 'λύω',
              second: 'λύεις',
              third: 'λύει'
            },
            plural: {
              first: 'λύομεν',
              second: 'λύετε',
              third: 'λύουσι(ν)'
            }
          }
        }
      ]
    }
  }
]

export const exerciseTemplates = [
  {
    type: 'translation',
    title: 'Traducción',
    description: 'Traduce las siguientes frases del griego al español',
    exercises: [
      {
        greek: 'ὁ ἀνὴρ σοφός ἐστι.',
        correct: 'El hombre es sabio.',
        hints: ['ὁ = el (artículo)', 'ἀνήρ = hombre', 'σοφός = sabio', 'ἐστι = es']
      },
      {
        greek: 'ἡ σοφία καλή ἐστι.',
        correct: 'La sabiduría es bella.',
        hints: ['ἡ = la (artículo)', 'σοφία = sabiduría', 'καλή = bella', 'ἐστι = es']
      }
    ]
  },
  {
    type: 'morphology',
    title: 'Análisis Morfológico',
    description: 'Identifica la forma y función de las palabras marcadas',
    exercises: [
      {
        sentence: 'τοῦ **σοφοῦ** ἀνδρὸς λόγος.',
        word: 'σοφοῦ',
        correct: {
          lemma: 'σοφός',
          partOfSpeech: 'adjetivo',
          case: 'genitivo',
          number: 'singular',
          gender: 'masculino'
        }
      }
    ]
  }
]

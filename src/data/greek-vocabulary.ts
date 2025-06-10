// Datos de vocabulario griego básico para análisis morfológico
export const greekVocabulary = [
  {
    greekWord: 'μῆνις',
    lemma: 'μῆνις',
    partOfSpeech: 'sustantivo',
    definition: 'cólera, ira, enojo divino',
    etymology: 'De la raíz indoeuropea *men- (pensar, recordar)',
    examples: [
      'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος (Canta, diosa, la cólera del Pelida Aquiles)',
      'θεῶν μῆνις (la cólera de los dioses)'
    ],
    morphology: {
      declension: '3ª declinación',
      gender: 'femenino',
      cases: {
        nominativo: { singular: 'μῆνις', plural: 'μήνιδες' },
        genitivo: { singular: 'μήνιδος', plural: 'μηνίδων' },
        dativo: { singular: 'μήνιδι', plural: 'μήνισι(ν)' },
        acusativo: { singular: 'μῆνιν', plural: 'μήνιδας' },
        vocativo: { singular: 'μῆνι', plural: 'μήνιδες' }
      }
    },
    frequency: 85,
    level: 'INTERMEDIATE'
  },
  {
    greekWord: 'ἀείδω',
    lemma: 'ἀείδω',
    partOfSpeech: 'verbo',
    definition: 'cantar, celebrar en verso',
    etymology: 'De la raíz indoeuropea *h₂weid- (ver, saber)',
    examples: [
      'ἄειδε θεὰ (canta, diosa)',
      'κλέα ἀνδρῶν ἀείδειν (cantar las glorias de los hombres)'
    ],
    morphology: {
      conjugation: 'contracto en -ω',
      voice: 'activa',
      tenses: {
        presente: {
          indicativo: {
            'primera_singular': 'ἀείδω',
            'segunda_singular': 'ἀείδεις',
            'tercera_singular': 'ἀείδει'
          },
          imperativo: {
            'segunda_singular': 'ἄειδε',
            'tercera_singular': 'ἀειδέτω'
          }
        }
      }
    },
    frequency: 65,
    level: 'BEGINNER'
  },
  {
    greekWord: 'θεός',
    lemma: 'θεός',
    partOfSpeech: 'sustantivo',
    definition: 'dios, divinidad',
    etymology: 'De origen incierto, posiblemente relacionado con θέω (correr)',
    examples: [
      'θεὰ Ἀθήνη (la diosa Atenea)',
      'θεοὶ ἀθάνατοι (dioses inmortales)'
    ],
    morphology: {
      declension: '2ª declinación',
      gender: 'masculino/femenino',
      cases: {
        nominativo: { singular: 'θεός/θεά', plural: 'θεοί/θεαί' },
        genitivo: { singular: 'θεοῦ/θεᾶς', plural: 'θεῶν' },
        dativo: { singular: 'θεῷ/θεᾷ', plural: 'θεοῖς/θεαῖς' },
        acusativo: { singular: 'θεόν/θεάν', plural: 'θεούς/θεάς' },
        vocativo: { singular: 'θεέ/θεά', plural: 'θεοί/θεαί' }
      }
    },
    frequency: 95,
    level: 'BEGINNER'
  },
  {
    greekWord: 'Ἀχιλλεύς',
    lemma: 'Ἀχιλλεύς',
    partOfSpeech: 'sustantivo propio',
    definition: 'Aquiles, héroe de la guerra de Troya',
    etymology: 'Nombre propio griego, posiblemente relacionado con ἄχος (dolor)',
    examples: [
      'Πηληϊάδεω Ἀχιλῆος (del Pelida Aquiles)',
      'δῖος Ἀχιλλεύς (el divino Aquiles)'
    ],
    morphology: {
      declension: '3ª declinación',
      gender: 'masculino',
      cases: {
        nominativo: { singular: 'Ἀχιλλεύς' },
        genitivo: { singular: 'Ἀχιλλέως/Ἀχιλῆος' },
        dativo: { singular: 'Ἀχιλλεῖ/Ἀχιλῆι' },
        acusativo: { singular: 'Ἀχιλλέα/Ἀχιλῆα' },
        vocativo: { singular: 'Ἀχιλλεῦ' }
      }
    },
    frequency: 70,
    level: 'INTERMEDIATE'
  },
  {
    greekWord: 'οὐλόμενος',
    lemma: 'οὐλόμενος',
    partOfSpeech: 'adjetivo',
    definition: 'funesto, destructivo, maldito',
    etymology: 'Del verbo ὄλλυμι (destruir)',
    examples: [
      'οὐλομένην μῆνιν (la funesta cólera)',
      'οὐλόμενον ἦμαρ (día funesto)'
    ],
    morphology: {
      declension: '1ª y 2ª declinación',
      comparison: 'positivo',
      cases: {
        nominativo: { 
          singular: 'οὐλόμενος/οὐλομένη/οὐλόμενον',
          plural: 'οὐλόμενοι/οὐλόμεναι/οὐλόμενα'
        }
      }
    },
    frequency: 45,
    level: 'ADVANCED'
  },
  {
    greekWord: 'ἄλγος',
    lemma: 'ἄλγος',
    partOfSpeech: 'sustantivo',
    definition: 'dolor, sufrimiento, pena',
    etymology: 'De la raíz indoeuropea *h₂elg- (frío, dolor)',
    examples: [
      'μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε (causó miles de dolores a los aqueos)',
      'ἄλγεα θυμῷ (dolores en el corazón)'
    ],
    morphology: {
      declension: '3ª declinación',
      gender: 'neutro',
      cases: {
        nominativo: { singular: 'ἄλγος', plural: 'ἄλγεα/ἄλγη' },
        genitivo: { singular: 'ἄλγους', plural: 'ἀλγέων' },
        dativo: { singular: 'ἄλγει', plural: 'ἄλγεσι(ν)' },
        acusativo: { singular: 'ἄλγος', plural: 'ἄλγεα/ἄλγη' }
      }
    },
    frequency: 60,
    level: 'INTERMEDIATE'
  },
  {
    greekWord: 'τίθημι',
    lemma: 'τίθημι',
    partOfSpeech: 'verbo',
    definition: 'poner, colocar, establecer',
    etymology: 'De la raíz indoeuropea *dʰeh₁- (poner, hacer)',
    examples: [
      'ἔθηκε νόμους (estableció leyes)',
      'θέσθαι ὅπλα (depositar las armas)'
    ],
    morphology: {
      conjugation: 'verbo en -μι',
      voice: 'activa/media',
      tenses: {
        presente: {
          indicativo: {
            'primera_singular': 'τίθημι',
            'segunda_singular': 'τίθης',
            'tercera_singular': 'τίθησι'
          }
        },
        aoristo: {
          indicativo: {
            'primera_singular': 'ἔθηκα',
            'tercera_singular': 'ἔθηκε'
          }
        }
      }
    },
    frequency: 80,
    level: 'INTERMEDIATE'
  }
]

// Formas morfológicas para análisis
export const morphologicalForms = [
  { word: 'λόγου', lemma: 'λόγος', case: 'genitivo', number: 'singular' },
  { word: 'λόγῳ', lemma: 'λόγος', case: 'dativo', number: 'singular' },
  { word: 'λόγον', lemma: 'λόγος', case: 'acusativo', number: 'singular' },
  { word: 'λόγοι', lemma: 'λόγος', case: 'nominativo', number: 'plural' },
  { word: 'εἰμί', lemma: 'εἰμί', person: 'primera', number: 'singular', tense: 'presente' },
  { word: 'εἶ', lemma: 'εἰμί', person: 'segunda', number: 'singular', tense: 'presente' },
  { word: 'ἐστί', lemma: 'εἰμί', person: 'tercera', number: 'singular', tense: 'presente' },
  { word: 'ἐσμέν', lemma: 'εἰμί', person: 'primera', number: 'plural', tense: 'presente' },
  { word: 'ἐστέ', lemma: 'εἰμί', person: 'segunda', number: 'plural', tense: 'presente' },
  { word: 'εἰσί', lemma: 'εἰμί', person: 'tercera', number: 'plural', tense: 'presente' }
]

// Patrones sintácticos comunes
export const syntacticPatterns = [
  {
    pattern: 'Sujeto + Verbo + Objeto',
    description: 'Estructura básica de oración griega',
    frequency: 45,
    examples: ['ὁ ἄνθρωπος λέγει λόγον', 'ἡ σοφία διδάσκει τὸν μαθητήν']
  },
  {
    pattern: 'Artículo + Sustantivo + Adjetivo',
    description: 'Sintagma nominal con adjetivo',
    frequency: 35,
    examples: ['ὁ σοφὸς ἄνθρωπος', 'ἡ καλὴ πόλις']
  },
  {
    pattern: 'Genitivo de posesión',
    description: 'Genitivo que indica pertenencia',
    frequency: 25,
    examples: ['ὁ υἱὸς τοῦ βασιλέως', 'ἡ σοφία τῶν φιλοσόφων']
  },
  {
    pattern: 'Participio + Sustantivo',
    description: 'Construcción participial',
    frequency: 20,
    examples: ['ὁ λέγων ἄνθρωπος', 'ἡ διδάσκουσα γυνή']
  }
]

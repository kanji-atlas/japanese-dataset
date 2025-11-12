const pathKanjiApiFull = './local-data/kanjiapi_full.json';
const pathKanjiExtended = './local-data/kanji_extended.json'
const pathKanjiMain = './local-data/kanji_main.json'
const pathComponents = './local-data/component_keyword.json'
const pathFurigana = './local-data/vocab_furigana.json'
// const pathFuriganaMeaning = './local-data/vocab_meaning.json'

const pathDataset = './dataset/base/';
const pathTranslationEn = './dataset/translation/en/';

(async () => {
  const contentKanjiApi: {
    kanjis: Record<string, {
      freq_mainichi_shinbun: number | undefined;
      grade: number | undefined;
      heisig_en: string | undefined;
      jlpt: number | undefined;
      kanji: string;
      kun_readings: string[];
      meanings: string[];
      name_readings: string[];
      notes: string[];
      on_readings: string[];
      stroke_count: number;
      unicode: string;
    }>,
    words: Record<string, {
      meanings: {
        glosses: string[];
      }[];
      variants: {
        priorities: string[];
        pronounced: string;
        written: string;
      }[];
    }[]>,
    readings: Record<string, {
      reading: string;
      main_kanji: string[];
      name_kanji: string[];
    }>
  } = await Bun.file(pathKanjiApiFull).json();

  const contentKanjiExtended: Record<string, any[]> = await Bun.file(pathKanjiExtended).json()
  const contentKanjiMain: Record<string, string[]> = await Bun.file(pathKanjiMain).json()
  const contentComponent: Record<string, string> = await Bun.file(pathComponents).json()
  const vocabFurigana = await Bun.file(pathFurigana).json()

  const baseKanjis = Bun.file(`${pathDataset}kanji.json`)
  const baseWords = Bun.file(`${pathDataset}word.json`)
  const readings = Bun.file(`${pathDataset}reading.json`)
  const components = Bun.file(`${pathDataset}radical.json`)

  const kanjiTranslation = Bun.file(`${pathTranslationEn}kanji.json`)
  const wordsTranslation = Bun.file(`${pathTranslationEn}word.json`)
  const kanjiComponentTranslation = Bun.file(`${pathTranslationEn}radical.json`)

  const baseK: Record<string, {
    kanji: string,
    unicode: string,
    stroke_count: number,
    grade?: number,
    jlpt?: number,
    mainichi_shinbun?: number,
    main_on_reading: string,
    main_kun_reading: string,
    radicals: string[],
    related_words: string[],
    on_readings: string[],
    kun_readings: string[],
    name_readings: string[],
  }> = {},
    baseW: Record<string, {
      main_writing: string,
      main_reading: string,
      main_kanjis: string[],
      variants: {
        reading: string,
        writing: string
        priorities: string[],
      }[],
      furigana: {
        part: string,
        reading: string,
      }[]
    }> = {},
    kanjiT: Record<string, {
      keyword: string,
      meanings: string[],
      notes: string[],
      auto_translated: boolean,
    }> = {},
    wordsT: Record<string, {
      main_meaning: string,
      meanings: string[],
      auto_translated: boolean
    }> = {}

  const kcomponents = Object.keys(contentComponent)
  const kanjisHeatmaps = Object.keys(contentKanjiMain)

  kanjisHeatmaps.forEach(k => {
    const kapi = contentKanjiApi.kanjis[k]
    if (kapi === undefined) {
      console.log(k)
      return
    }
    const kmain = contentKanjiMain[k]
    const kext = contentKanjiExtended[k]
    baseK[k] = {
      kanji: kapi.kanji,
      unicode: kapi.unicode,
      stroke_count: kapi.stroke_count,
      grade: kapi.grade,
      jlpt: kapi.jlpt,
      mainichi_shinbun: kapi.freq_mainichi_shinbun,

      radicals: kext[0],
      related_words: kext[9],
      main_on_reading: kmain[1],
      main_kun_reading: kmain[2],
      on_readings: kext[6],
      kun_readings: kext[7],
      name_readings: kapi.name_readings,
    }
    kanjiT[k] = {
      keyword: kmain[0],
      meanings: kext[5],
      notes: kapi.notes,
      auto_translated: false
    }
  })

  Object.values(contentKanjiApi.kanjis).forEach(k => {
    if (contentKanjiExtended[k.kanji] !== undefined) {
      return;
    }
    baseK[k.kanji] = {
      kanji: k.kanji,
      unicode: k.unicode,
      stroke_count: k.stroke_count,
      grade: k.grade,
      jlpt: k.jlpt,
      mainichi_shinbun: k.freq_mainichi_shinbun,
      related_words: [],
      radicals: [],
      main_on_reading: k.on_readings[0],
      main_kun_reading: k.kun_readings[0],
      on_readings: k.on_readings,
      kun_readings: k.kun_readings,
      name_readings: k.name_readings
    }
    if (k.meanings.length > 0 || (k.heisig_en?.length ?? 0) > 0) {
      kanjiT[k.kanji] = {
        keyword: k.heisig_en ?? k.meanings[0],
        meanings: k.meanings,
        notes: k.notes,
        auto_translated: false
      }
    }
  })

  console.log(Object.entries(baseK).length)
  Object.entries(contentKanjiApi.words).forEach(([k, kanjiWords]) => {
    kanjiWords.forEach(w => {
      const { written: writing, pronounced: reading } = w.variants[0]
      if (baseW[writing] !== undefined) {
        if (!baseW[writing].main_kanjis.find(kj => kj === k))
          baseW[writing].main_kanjis.push(k)
      } else {
        baseW[writing] = {
          variants: w.variants.map(v => { return { writing: v.written, reading: v.pronounced, priorities: v.priorities } }),
          main_writing: writing,
          main_reading: reading,
          main_kanjis: [k],
          furigana: vocabFurigana[writing] !== undefined ? vocabFurigana[writing].map(f => {
            return {
              part: f[0],
              reading: f[1] ?? f[0]
            }
          }) : []
        }
        const translations = w.meanings.flatMap(m => m.glosses)
        if (translations.length > 0) {
          wordsT[writing] = {
            main_meaning: translations[0],
            meanings: translations,
            auto_translated: false
          }
        }
      }
    })
  })
  await baseKanjis.write(JSON.stringify(baseK))
  await baseWords.write(JSON.stringify(baseW))
  await readings.write(JSON.stringify(contentKanjiApi.readings))
  await components.write(JSON.stringify(kcomponents))
  await kanjiTranslation.write(JSON.stringify(kanjiT))
  await wordsTranslation.write(JSON.stringify(wordsT))
  await kanjiComponentTranslation.write(JSON.stringify(contentComponent))
  console.log(Object.values(baseW).length, Object.values(wordsT).length)
})()


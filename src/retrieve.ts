import type { Kanji, Word, Reading } from "./types"

const pathKanjiApiFull = './local-data/kanjiapi_full.json';
const pathKanjiExtended = './local-data/kanji_extended.json'
const pathKanjiMain = './local-data/kanji_main.json'
const pathComponents = './local-data/component_keyword.json'
const pathFurigana = './local-data/vocab_furigana.json'
// const pathFuriganaMeaning = './local-data/vocab_meaning.json'

const pathDataset = './dataset/base/'
const pathTranslationEn = './dataset/translation/en/'

const doJob = async () => {
  const contentKanjiApi: {
    kanjis: Record<string, Kanji>,
    words: Record<string, Word[]>,
    readings: Record<string, Reading>
  } = await Bun.file(pathKanjiApiFull).json();

  const contentKanjiExtended: Record<string, any[]> = await Bun.file(pathKanjiExtended).json()
  const contentKanjiMain: Record<string, string[]> = await Bun.file(pathKanjiMain).json()
  const contentComponent: Record<string, string> = await Bun.file(pathComponents).json()
  const vocabFurigana = await Bun.file(pathFurigana).json()

  const baseKanjis = Bun.file(`${pathDataset}kanji.json`)
  const baseWords = Bun.file(`${pathDataset}word.json`)
  const readings = Bun.file(`${pathDataset}reading.json`)
  const components = Bun.file(`${pathDataset}kanji_component.json`)

  const kanjiTranslation = Bun.file(`${pathTranslationEn}kanji.json`)
  const wordsTranslation = Bun.file(`${pathTranslationEn}word.json`)
  const kanjiComponentTranslation = Bun.file(`${pathTranslationEn}component_keyword.json`)

  const baseK: {
    kanji: string,
    unicode: string,
    stroke_count: number,
    grade?: number,
    jlpt?: number,
    mainichi_shinbun?: number,
    related_words: string[],
    components: string[],
    main_on_reading: string,
    main_kun_reading: string,
    on_readings: string[],
    kun_readings: string[],
    name_readings: string[],
  }[] = [],
    baseW: Record<string, {
      variants: {
        priorities: string[],
        pronounced: string,
        written: string
      }[],
      main_written: string,
      main_pronounced: string,
      main_kanjis: string[],
      furigana: {
        part: string,
        reading: string,
      }[]
    }> = {},
    kanjiT = {},
    wordsT: Record<string, {
      main_meaning: string,
      meanings: string[]
    }> = {}

  const kcomponents = Object.keys(contentComponent)

  const kanjisHeatmaps = Object.keys(contentKanjiMain)

  Object.values(contentKanjiApi.kanjis).forEach(k => {
    if (contentKanjiExtended[k.kanji] !== undefined) {
      const kmain = contentKanjiMain[k.kanji]
      const kext = contentKanjiExtended[k.kanji]
      baseK.splice(kanjisHeatmaps.findIndex(v => v === k.kanji), 0, {
        kanji: k.kanji,
        unicode: k.unicode,
        stroke_count: k.stroke_count,
        grade: k.grade,
        jlpt: k.jlpt,
        mainichi_shinbun: k.freq_mainichi_shinbun,
        related_words: kext[9],
        components: kext[0],
        main_on_reading: kmain[1],
        main_kun_reading: kmain[2],
        on_readings: kext[6],
        kun_readings: kext[7],
        name_readings: k.name_readings,
      })
      kanjiT[k.kanji] = {
        main_maning: kmain[0],
        meanings: kext[5],
      }
      return;
    }
    baseK.push({
      kanji: k.kanji,
      unicode: k.unicode,
      stroke_count: k.stroke_count,
      grade: k.grade,
      jlpt: k.jlpt,
      mainichi_shinbun: k.freq_mainichi_shinbun,
      related_words: [],
      components: [],
      main_on_reading: k.on_readings[0],
      main_kun_reading: k.kun_readings[0],
      on_readings: k.on_readings,
      kun_readings: k.kun_readings,
      name_readings: k.name_readings
    })
    if (k.meanings.length > 0 || (k.heisig_en?.length ?? 0) > 0) {
      kanjiT[k.kanji] = {
        main_meaning: k.heisig_en ?? k.meanings[0],
        meanings: k.meanings,
      }
    }
  })

  // console.log(JSON.stringify(contents.words.恋))
  console.log(Object.entries(contentKanjiApi.kanjis).length)
  let wordID = 0
  Object.entries(contentKanjiApi.words).forEach(([k, kanjiWords]) => {
    kanjiWords.forEach(w => {
      const { written, pronounced } = w.variants[0]
      if (baseW[written] !== undefined) {
        if (!baseW[written].main_kanjis.find(kj => kj === k))
          baseW[written].main_kanjis.push(k)
      } else {
        baseW[written] = {
          variants: w.variants,
          main_written: written,
          main_pronounced: pronounced,
          main_kanjis: [k],
          furigana: vocabFurigana[written] !== undefined ? vocabFurigana[written].map(f => {
            return {
              part: f[0],
              reading: f[1] ?? f[0]
            }
          }) : []
        }
        const translations = w.meanings.flatMap(m => m.glosses)
        if (translations.length > 0) {
          wordsT[written] = {
            main_meaning: translations[0],
            meanings: translations
          }
        }
        wordID++
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
  // console.log(Object.values(baseW).length, Object.values(wordsT).length)
}

doJob()

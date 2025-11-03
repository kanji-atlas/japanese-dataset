import type { Kanji, Word, Reading } from "./types"

const path = './kanjiapi_full.json';

const pathDataset = './dataset/'
const pathTranslationEn = './dataset/translation/en/'


const doJob = async () => {
  const contents: {
    kanjis: Record<string, Kanji>,
    words: Record<string, Word[]>,
    readings: Record<string, Reading>
  } = await Bun.file(path).json();

  const baseKanjis = Bun.file(`${pathDataset}/base_kanjis.json`)
  const baseWords = Bun.file(`${pathDataset}/base_words.json`)
  const readings = Bun.file(`${pathDataset}/readings.json`)

  const kanjiTranslation = `${pathTranslationEn}/kanjis.json`
  const wordsTranslation = `${pathTranslationEn}/words.json`

  const baseK = {}, baseW = {}, kanjiT = {}, wordsT = {}, reading = {}

  // Object.values(contents.kanjis).forEach(k => {
  //   baseK[k.kanji] = {
  //     kanji: k.kanji,
  //     unicode: k.unicode,
  //     stroke_count: k.stroke_count,
  //     grade: k.grade,
  //     jlpt: k.jlpt,
  //     mainichi_shinbun: k.freq_mainichi_shinbun,
  //     kun_readings: k.kun_readings,
  //     on_readings: k.on_readings,
  //     name_readings: k.name_readings
  //   }
  //   if (k.meanings.length > 0 || k.notes.length > 0 || (k.heisig_en?.length ?? 0) > 0) {
  //     kanjiT[k.kanji] = {
  //       meanings: k.meanings,
  //       notes: k.notes,
  //       keyword: k.heisig_en
  //     }
  //   }
  // })

  // console.log(JSON.stringify(contents.words.恋))
  let count = 0
  Object.entries(contents.words).forEach(([k, w]) => {
    w.forEach(wrd => {
      const thisTime = count
      wrd.variants.forEach(v => {
        if (v.written === "遠恋") {
          count++
        }
      })
      if (count !== thisTime) {
        console.log(wrd.variants, " HEY ")
      }
    })
    // const baseValues: {}[] = []
    // const translateValues: {}[] = []
    // w.forEach((wrd, i) => {
    //   baseValues.push({
    //     id: i,
    //     variants: wrd.variants,
    //   })
    //   translateValues.push({
    //     id: i,
    //     meanings: wrd.meanings.map(m => m.glosses)
    //   })
    // })
    // baseW[k] = baseValues
    // wordsT[k] = translateValues
  })
  console.log(count)

  // console.log(Object.values(baseW).length, Object.values(wordsT).length)
}

doJob()

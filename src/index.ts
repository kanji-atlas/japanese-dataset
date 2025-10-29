import type { Kanji, Word, Reading } from "./types"

const path = './kanjiapi_full.json';
const pathKanjis = './kanjis.json'

const pathTranslationEn = './kanji.translations.en.json'


const doJob = async () => {
  const contents: { kanjis: Record<string, Kanji>, words: Record<string, Word[]>, readings: Record<string, Reading> } = await Bun.file(path).json();

  console.log(JSON.stringify(contents.words.死))
}

doJob()

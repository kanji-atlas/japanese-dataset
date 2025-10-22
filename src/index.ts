import type { Kanji, Word, Reading } from "./types"

const path = './kanjiapi_full.json';

const doJob = async () => {
  const contents: { kanjis: Record<string, Kanji>, words: Record<string, Word[]>, readings: Record<string, Reading> } = await Bun.file(path).json();

  console.log(Object.values(contents.kanjis).filter(v => v.stroke_count).length)
}

doJob()

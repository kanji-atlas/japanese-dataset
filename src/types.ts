export type Kanji = {
  kanji: string,
  unicode: string,
  stroke_count: number,
  grade?: number,
  jlpt?: number,
  mainichi_shinbun?: number,
  related_words: string[],
  radicals: string[],
  main_on_reading: string,
  main_kun_reading: string,
  on_readings: string[],
  kun_readings: string[],
  name_readings: string[],
}

export type Word = {
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
}

export type Reading = {
  reading: string;
  main_kanji: string[];
  name_kanji: string[];
}

export type KanjiTranslation = {
  keyword: string,
  meanings: string[],
  notes: string[],
  auto_translated: boolean
}

export type WordTranslation = {
  main_meaning: string,
  meanings: string[],
  auto_translated: boolean
}

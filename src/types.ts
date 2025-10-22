
export type Kanji = {
  freq_mainichi_shinbun: number | null;
  grade: number | null;
  heisig_en: string | null;
  jlpt: number | null;
  kanji: string;
  kun_readings: string[];
  meanings: string[];
  name_readings: string[];
  notes: string[];
  on_readings: string[];
  stroke_count: number;
  unicode: string;
}

export type Word = {
  meanings: {
    glosses: string[];
  }[];
  variants: {
    priorities: string[];
    pronounced: string;
    written: string;
  }[];
}

export type Reading = {
  main_kanji: string[];
  name_kanji: string[];
  reading: string;
}

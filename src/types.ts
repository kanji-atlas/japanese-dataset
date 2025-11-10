
export type Kanji = {
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
  reading: string;
  main_kanji: string[];
  name_kanji: string[];
}

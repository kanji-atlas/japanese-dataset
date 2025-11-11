import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";


export const kanjis = sqliteTable("kanji", {
  kanji: text().primaryKey().notNull(),
  unicode: text().notNull(),
  jlpt: integer(),
  grade: integer(),
  mainichiShinbun: integer(),
  strokeCount: integer().notNull(),
  kunReadings: text({ mode: "json" }).$type<string[]>().default([]),
  onReadings: text({ mode: "json" }).$type<string[]>().default([]),
  nameReadings: text({ mode: "json" }).$type<string[]>().default([]),
}, (t) => [
  unique().on(t.kanji),
  index("idx_unicode_kanji").on(t.kanji)
])

export const kanjiTranslations = sqliteTable("kanji_translation", {
  id: integer().primaryKey({ autoIncrement: true }),
  kanji: text().notNull().references(() => kanjis.kanji),
  language: text().notNull(),
  keyword: text(),
  notes: text({ mode: "json" }).$type<string[]>().default([]),
  meanings: text({ mode: "json" }).$type<string[]>().default([]),
  autoTranslated: integer({ mode: "boolean" }).default(false)
  // When AI or translation tools are used instead of a professional
},
  (t) => [
    unique().on(t.kanji, t.language),
    index("idx_unicode_translation").on(t.kanji),
  ]
)

export const words = sqliteTable("word", {
  id: integer().primaryKey({ autoIncrement: true }),
  associatedKanji: text().notNull().references(() => kanjis.kanji),
  variants: text({ mode: "json" }).$type<{
    priorities: string[],
    pronounced: string,
    written: string
  }[]>().default([]),
})

export const wordTranslations = sqliteTable("word_translation", {
  id: integer().primaryKey({ autoIncrement: true }),
  associatedKanji: text().notNull().references(() => kanjis.kanji),
  language: text().notNull(),
  glosses: text({ mode: "json" }).$type<string[]>().default([]),
  autoTranslated: integer({ mode: "boolean" }).default(false)
})


export const readings = sqliteTable("reading", {
  reading: text().primaryKey().notNull(),
  mainKanjis: text({ mode: "json" }).$type<string[]>().default([]),
  nameKanjis: text({ mode: "json" }).$type<string[]>().default([]),
})



import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";


export const kanjis = sqliteTable("kanji", {
  kanji: text().primaryKey().notNull(),
  unicode: text().notNull(),
  jlpt: integer(),
  grade: integer(),
  mainichiShinbun: integer("mainichi_shinbun"),
  strokeCount: integer("stroke_count").notNull(),
  kunReadings: text("kun_readings", { mode: "json" }).$type<string[]>().default([]),
  onReadings: text("on_readings", { mode: "json" }).$type<string[]>().default([]),
  nameReadings: text("name_readings", { mode: "json" }).$type<string[]>().default([]),
}, (t) => [
  unique().on(t.kanji),
  index("idx_unicode_kanji").on(t.kanji)
])

export const kanjiTranslations = sqliteTable("kanji_translation", {
  kanji: text().primaryKey().notNull().references(() => kanjis.kanji),
  language: text().notNull(),
  keyword: text(),
  notes: text({ mode: "json" }).$type<string[]>().default([]),
  meanings: text({ mode: "json" }).$type<string[]>().default([])
},
  (t) => [
    unique().on(t.kanji, t.language),
    index("idx_unicode_translation").on(t.kanji),
  ]
)

export const words = sqliteTable("word", {
  id: integer().primaryKey({ autoIncrement: true }),
  associatedKanji: text("associated_kanji").primaryKey().notNull().references(() => kanjis.kanji),
  pronounce: text({ mode: "json" }).$type<string[]>().default([]),

})

export const readings = sqliteTable("reading", {
  reading: text().primaryKey().notNull(),
  mainKanjis: text("main_kanjis", { mode: "json" }).$type<string[]>().default([]),
  nameKanjis: text("kun_readings", { mode: "json" }).$type<string[]>().default([]),
})



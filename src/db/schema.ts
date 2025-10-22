import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";


export const kanji = sqliteTable("kanji", {
  unicode: text().primaryKey().notNull(),
  kanji: text().notNull(),
  jlpt: integer(),
  grade: integer(),
  mainichiShinbun: integer("mainichi_shinbun"),
  strokeCount: integer("stroke_count").notNull(),
  kunReadings: text("kun_readings", { mode: "json" }).$type<string[]>().default([]),
  onReadings: text("on_readings", { mode: "json" }).$type<string[]>().default([]),
  nameReadings: text("name_readings", { mode: "json" }).$type<string[]>().default([]),
}, (t) => [
  unique().on(t.unicode),
  index("idx_unicode_kanji").on(t.unicode)
])

export const translation = sqliteTable("translation", {
  unicode: text().notNull().primaryKey().references(() => kanji.unicode),
  language: text().notNull(),
  keyword: text(),
  notes: text({ mode: "json" }).$type<string[]>().default([]),
  meanings: text({ mode: "json" }).$type<string[]>().default([])
},
  (t) => [
    unique().on(t.unicode, t.language),
    index("idx_unicode_translation").on(t.unicode),
  ]
)

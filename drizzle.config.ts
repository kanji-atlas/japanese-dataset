import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./out/dataset.db",
  },
  verbose: false,
  strict: true,
  casing: "snake_case",
  out: "./migrations",
});

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from 'bun:sqlite';
import * as schema from "./schema"


const sqlite = new Database('./out/dataset.db');
export const db = drizzle({ client: sqlite, schema, casing: "snake_case" })



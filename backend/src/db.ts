import { Pool } from "pg"

export const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'blog',
    password: 'Blackestnight00',
    port: 5432,
})
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://default:pqL1uA4zFyIm@ep-hidden-silence-93838659-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb";
exports.db = new pg_1.Pool({
    connectionString: POSTGRES_URL + "?sslmode=require",
});
exports.db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connect to DB successfully!");
});
//# sourceMappingURL=db.js.map
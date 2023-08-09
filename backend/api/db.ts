import { Pool } from "pg"

const POSTGRES_URL= process.env.POSTGRES_URL || "postgres://default:pqL1uA4zFyIm@ep-hidden-silence-93838659-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb"


export const db = new Pool({
    connectionString: POSTGRES_URL + "?sslmode=require",
})

db.connect((err) =>{
    if(err){
        console.log(err)
        return
    }
    console.log("Connect to DB successfully!")
})
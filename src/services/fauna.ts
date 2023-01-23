import { Client } from 'faunadb'

export const faunadb = new Client({
  secret: process.env.FAUNADB_SECRET_KEY!,
  domain: 'db.us.fauna.com'
})

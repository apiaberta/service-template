import mongoose from 'mongoose'
import cron from 'node-cron'
import { buildApp, SERVICE_NAME } from './app.js'
import { fetchAndStore } from './connector.js'

const PORT = parseInt(process.env.PORT || '3001')
const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/apiaberta-${SERVICE_NAME}`

const app = buildApp({
  logger: {
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty' }
      : undefined
  }
})

// ─── Cron: fetch data on a schedule ─────────────────────────────────────────

// TODO: adjust schedule as needed
cron.schedule('0 6 * * *', async () => {
  app.log.info('Running scheduled data fetch...')
  try {
    await fetchAndStore()
    app.log.info('Data fetch complete')
  } catch (err) {
    app.log.error({ err }, 'Data fetch failed')
  }
})

// ─── Startup ────────────────────────────────────────────────────────────────

await mongoose.connect(MONGO_URI)
app.log.info('Connected to MongoDB')

// Fetch on startup if no data exists
await fetchAndStore().catch(err => app.log.warn({ err }, 'Initial fetch failed'))

await app.listen({ port: PORT, host: '0.0.0.0' })

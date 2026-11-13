import Fastify from 'fastify'
import { dataRoutes } from './routes/data.js'

// TODO: change this to your service name (lowercase, e.g. 'fuel'). It becomes
// the public prefix: https://api.apiaberta.pt/v1/<SERVICE_NAME>/...
export const SERVICE_NAME = 'my-service'

/**
 * Build the Fastify app without connecting to MongoDB or starting cron,
 * so tests can call it with app.inject().
 */
export function buildApp({ logger = false } = {}) {
  const app = Fastify({ logger })

  // ─── Required endpoints (contract with gateway) ──────────────────────────

  // Health check - MANDATORY, served at the root. The gateway probes
  // `${SERVICE_URL}/health` for GET /v1/status.
  app.get('/health', async () => ({
    status: 'ok',
    service: SERVICE_NAME,
    timestamp: new Date().toISOString()
  }))

  // Metadata - MANDATORY, served under the service prefix like every data
  // route, so it is reachable through the gateway as /v1/<SERVICE_NAME>/meta.
  app.get(`/${SERVICE_NAME}/meta`, async () => ({
    service: SERVICE_NAME,
    source: 'https://source-url.gov.pt', // TODO: replace with actual source
    description: 'What this service provides',
    last_updated: await getLastUpdated(),
    record_count: await getRecordCount(),
    update_frequency: 'daily'
  }))

  // ─── Data routes ─────────────────────────────────────────────────────────

  // The gateway strips the leading /v1 before proxying, so a request for
  // /v1/<SERVICE_NAME>/items reaches this service as /<SERVICE_NAME>/items.
  // Do NOT register data routes under /v1 here.
  app.register(dataRoutes, { prefix: `/${SERVICE_NAME}` })

  return app
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export async function getLastUpdated() {
  // TODO: query your model for the most recent record
  return null
}

export async function getRecordCount() {
  // TODO: return count from your model
  return 0
}

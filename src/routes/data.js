/**
 * data.js — your public data routes
 *
 * Rules:
 * - Registered under /<service-name> (see app.js). The public URL is
 *   /v1/<service-name>/..., the gateway strips /v1 before proxying.
 * - Return JSON with consistent envelope: { data, meta }
 * - Support pagination: ?page=1&limit=20
 * - Support ?updated_since=ISO_DATE for polling
 * - Never expose internal IDs or raw source fields
 */

export async function dataRoutes(app) {

  // Example: GET /v1/<service-name>/items
  app.get('/items', {
    schema: {
      description: 'List items', // TODO: describe your endpoint
      tags: ['Data'],
      querystring: {
        type: 'object',
        properties: {
          page:          { type: 'integer', default: 1 },
          limit:         { type: 'integer', default: 20, maximum: 100 },
          updated_since: { type: 'string', format: 'date-time' }
        }
      }
    }
  }, async (req, reply) => {
    const { page = 1, limit = 20, updated_since } = req.query

    // TODO: query your model
    // const query = {}
    // if (updated_since) query.updated_at = { $gte: new Date(updated_since) }
    // const [items, total] = await Promise.all([
    //   MyModel.find(query).skip((page - 1) * limit).limit(limit),
    //   MyModel.countDocuments(query)
    // ])

    return {
      meta: {
        page,
        limit,
        total: 0, // TODO: replace with actual total
        pages: 0  // TODO: Math.ceil(total / limit)
      },
      data: []    // TODO: return your items
    }
  })
}

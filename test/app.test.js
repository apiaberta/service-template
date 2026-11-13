import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildApp, SERVICE_NAME } from '../src/app.js'

test('GET /health returns ok at the root', async () => {
  const app = buildApp()
  const res = await app.inject({ method: 'GET', url: '/health' })
  assert.equal(res.statusCode, 200)
  const body = res.json()
  assert.equal(body.status, 'ok')
  assert.equal(body.service, SERVICE_NAME)
  assert.ok(!Number.isNaN(Date.parse(body.timestamp)))
  await app.close()
})

test('GET /<service>/meta returns the metadata contract', async () => {
  const app = buildApp()
  const res = await app.inject({ method: 'GET', url: `/${SERVICE_NAME}/meta` })
  assert.equal(res.statusCode, 200)
  const body = res.json()
  for (const key of ['service', 'source', 'description', 'last_updated', 'record_count', 'update_frequency']) {
    assert.ok(key in body, `meta is missing "${key}"`)
  }
  await app.close()
})

test('data routes live under /<service>, not /v1 (gateway strips /v1)', async () => {
  const app = buildApp()
  const ok = await app.inject({ method: 'GET', url: `/${SERVICE_NAME}/items` })
  assert.equal(ok.statusCode, 200)
  const body = ok.json()
  assert.deepEqual(Object.keys(body).sort(), ['data', 'meta'])
  assert.deepEqual(Object.keys(body.meta).sort(), ['limit', 'page', 'pages', 'total'])

  const wrong = await app.inject({ method: 'GET', url: '/v1/items' })
  assert.equal(wrong.statusCode, 404)
  await app.close()
})

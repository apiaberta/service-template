import { test } from 'node:test'
import assert from 'node:assert'

// ─── Example tests ────────────────────────────────────────────────────────────
// Replace these with real tests for your service.

test('normalise strips unknown fields', () => {
  const raw = { id: 1, nome: 'Test', unknown_field: 'remove me' }
  const normalised = { id: 1, name: 'Test' }
  assert.deepStrictEqual(normalise(raw), normalised)
})

test('normalise converts date string to Date', () => {
  const raw = { id: 1, data: '2024-01-15' }
  const normalised = normalise(raw)
  assert.ok(normalised.updated_at instanceof Date)
})

// Placeholder — implement to match your actual normalise function
function normalise(raw) {
  return {
    id: raw.id,
    name: raw.nome,
    updated_at: raw.data ? new Date(raw.data) : null
  }
}

import { describe, it, expect } from 'vitest'

describe('Environment Variables', () => {
  it('should have access to process.env', () => {
    expect(process.env).toBeDefined()
  })

  it('should validate that NODE_ENV is set', () => {
    expect(process.env.NODE_ENV).toBeDefined()
  })
})

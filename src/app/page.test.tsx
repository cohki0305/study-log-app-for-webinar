import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the page title', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1, name: /vibe template/i })).toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

vi.mock('@/actions/auth', () => ({
  requestMagicLinkAction: vi.fn(),
}))

describe('LoginForm', () => {
  it('should render email input and submit button', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ログインリンクを送信/i })).toBeInTheDocument()
  })

  it('should allow typing in email input', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/メールアドレス/i)
    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should have placeholder text', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/メールアドレス/i)
    expect(emailInput).toHaveAttribute('placeholder', 'you@example.com')
  })

  it('should have email input type', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/メールアドレス/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })
})

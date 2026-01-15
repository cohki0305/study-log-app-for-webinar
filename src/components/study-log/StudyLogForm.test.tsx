import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudyLogForm } from './StudyLogForm'

vi.mock('@/actions/study-log', () => ({
  createStudyLogAction: vi.fn(),
  updateStudyLogAction: vi.fn(),
}))

describe('StudyLogForm', () => {
  it('should render all form fields', () => {
    render(<StudyLogForm />)

    expect(screen.getByLabelText(/学習日/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/学習内容/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/学習時間/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/振り返り/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /保存/i })).toBeInTheDocument()
  })

  it('should allow typing in content field', async () => {
    const user = userEvent.setup()
    render(<StudyLogForm />)

    const contentInput = screen.getByLabelText(/学習内容/i)
    await user.type(contentInput, 'TypeScriptの基礎を学習')

    expect(contentInput).toHaveValue('TypeScriptの基礎を学習')
  })

  it('should allow setting duration', async () => {
    const user = userEvent.setup()
    render(<StudyLogForm />)

    const durationInput = screen.getByLabelText(/学習時間/i)
    await user.clear(durationInput)
    await user.type(durationInput, '60')

    expect(durationInput).toHaveValue(60)
  })

  it('should pre-fill form when editing', () => {
    const defaultValues = {
      id: 'test-id',
      studyDate: '2026-01-15',
      content: '既存の学習内容',
      durationMinutes: 45,
      reflection: '振り返りテキスト',
    }

    render(<StudyLogForm defaultValues={defaultValues} />)

    expect(screen.getByLabelText(/学習内容/i)).toHaveValue('既存の学習内容')
    expect(screen.getByLabelText(/学習時間/i)).toHaveValue(45)
    expect(screen.getByLabelText(/振り返り/i)).toHaveValue('振り返りテキスト')
  })
})

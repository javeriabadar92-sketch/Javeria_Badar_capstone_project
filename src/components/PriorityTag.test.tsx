import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PriorityTag from './PriorityTag'

describe('PriorityTag', () => {
  it('displays "High" label when priority is high', () => {
    render(<PriorityTag priority="high" onChange={() => {}} />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('displays "Medium" label when priority is medium', () => {
    render(<PriorityTag priority="medium" onChange={() => {}} />)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('displays "Low" label when priority is low', () => {
    render(<PriorityTag priority="low" onChange={() => {}} />)
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('calls onChange with the next priority when clicked (high -> medium)', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<PriorityTag priority="high" onChange={handleChange} />)

    await user.click(screen.getByRole('button'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('has an accessible label describing the current priority', () => {
    render(<PriorityTag priority="medium" onChange={() => {}} />)
    expect(screen.getByRole('button')).toHaveAccessibleName(/Priority: Medium/i)
  })
})
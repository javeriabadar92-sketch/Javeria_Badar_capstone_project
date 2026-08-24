import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Disclosure } from './Disclosure'

describe('Disclosure', () => {
  it('renders the title', () => {
    render(<Disclosure title="Test Title">Content here</Disclosure>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('content is hidden by default', () => {
    render(<Disclosure title="Test Title">Hidden content</Disclosure>)
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('shows content after clicking the button', async () => {
    const user = userEvent.setup()
    render(<Disclosure title="Test Title">Revealed content</Disclosure>)

    const button = screen.getByRole('button', { name: /Test Title/i })
    await user.click(button)

    expect(screen.getByText('Revealed content')).toBeInTheDocument()
  })

  it('sets aria-expanded to false initially and true after click', async () => {
    const user = userEvent.setup()
    render(<Disclosure title="Test Title">Content</Disclosure>)

    const button = screen.getByRole('button', { name: /Test Title/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('hides content again after clicking twice', async () => {
    const user = userEvent.setup()
    render(<Disclosure title="Test Title">Toggle content</Disclosure>)

    const button = screen.getByRole('button', { name: /Test Title/i })
    await user.click(button)
    expect(screen.getByText('Toggle content')).toBeInTheDocument()

    await user.click(button)
    expect(screen.queryByText('Toggle content')).not.toBeInTheDocument()
  })
})
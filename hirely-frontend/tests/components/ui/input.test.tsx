import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('accepts text input', async () => {
    const { user } = render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement
    
    await user.type(input, 'Hello World')
    expect(input.value).toBe('Hello World')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('supports different input types', () => {
    const { rerender } = render(<Input type="text" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('custom-class')
  })

  it('handles onChange event', async () => {
    const handleChange = vi.fn()
    const { user } = render(<Input onChange={handleChange} placeholder="Test" />)
    
    const input = screen.getByPlaceholderText('Test')
    await user.type(input, 'a')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('can have default value', () => {
    render(<Input defaultValue="Default text" data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('Default text')
  })
})

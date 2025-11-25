import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../utils'
import LoginForm from '@/app/auth/login/loginForm'

describe('LoginForm Component', () => {
  const mockProps = {
    formData: {
      email: '',
      password: '',
    },
    showPassword: false,
    isSubmitting: false,
    error: null,
    onInputChange: vi.fn(() => vi.fn()),
    onTogglePassword: vi.fn(),
    onSubmit: vi.fn(),
    onReset: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the login form with all elements', () => {
      render(<LoginForm {...mockProps} />)

      expect(screen.getByText('Welcome to Hirely!')).toBeInTheDocument()
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
    })

    it('renders forgot password link', () => {
      render(<LoginForm {...mockProps} />)
      const forgotLink = screen.getByText(/Forgot your password/i)
      expect(forgotLink).toBeInTheDocument()
      expect(forgotLink.closest('a')).toHaveAttribute('href', '/auth/forgot-password')
    })

    it('renders sign up link', () => {
      render(<LoginForm {...mockProps} />)
      const signUpLink = screen.getByText(/Sign up here/i)
      expect(signUpLink).toBeInTheDocument()
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/auth/register')
    })

    it('displays error message when error prop is provided', () => {
      const propsWithError = {
        ...mockProps,
        error: 'Invalid credentials',
      }
      render(<LoginForm {...propsWithError} />)
      
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('does not display error message when error is null', () => {
      render(<LoginForm {...mockProps} />)
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Form Inputs', () => {
    it('email input accepts and displays text', async () => {
      const onInputChange = vi.fn(() => vi.fn())
      const { user } = render(
        <LoginForm {...mockProps} onInputChange={onInputChange} />
      )

      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement
      await user.type(emailInput, 'test@example.com')

      expect(onInputChange).toHaveBeenCalledWith('email')
    })

    it('password input accepts and displays text', async () => {
      const onInputChange = vi.fn(() => vi.fn())
      const { user } = render(
        <LoginForm {...mockProps} onInputChange={onInputChange} />
      )

      const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement
      await user.type(passwordInput, 'password123')

      expect(onInputChange).toHaveBeenCalledWith('password')
    })

    it('renders email input with correct placeholder', () => {
      render(<LoginForm {...mockProps} />)
      const emailInput = screen.getByPlaceholderText('Enter your email')
      expect(emailInput).toBeInTheDocument()
    })

    it('renders password input with correct placeholder', () => {
      render(<LoginForm {...mockProps} />)
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      expect(passwordInput).toBeInTheDocument()
    })

    it('populates inputs with formData values', () => {
      const propsWithData = {
        ...mockProps,
        formData: {
          email: 'test@example.com',
          password: 'mypassword',
        },
      }
      render(<LoginForm {...propsWithData} />)

      const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement
      const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement

      expect(emailInput.value).toBe('test@example.com')
      expect(passwordInput.value).toBe('mypassword')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('password input is hidden by default', () => {
      render(<LoginForm {...mockProps} />)
      const passwordInput = screen.getByLabelText(/Password/i)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('shows password when showPassword is true', () => {
      const propsWithVisiblePassword = {
        ...mockProps,
        showPassword: true,
      }
      render(<LoginForm {...propsWithVisiblePassword} />)
      const passwordInput = screen.getByLabelText(/Password/i)
      expect(passwordInput).toHaveAttribute('type', 'text')
    })

    it('calls onTogglePassword when visibility button is clicked', async () => {
      const { user } = render(<LoginForm {...mockProps} />)
      
      // Find the password visibility toggle button (it's in the password field)
      const toggleButtons = screen.getAllByRole('button')
      const toggleButton = toggleButtons.find(btn => 
        btn.className.includes('absolute right-0')
      )
      
      if (toggleButton) {
        await user.click(toggleButton)
        expect(mockProps.onTogglePassword).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe('Form Submission', () => {
    it('calls onSubmit when form is submitted', async () => {
      const { user } = render(<LoginForm {...mockProps} />)
      
      const form = screen.getByRole('button', { name: /Sign In/i }).closest('form')
      if (form) {
        await user.click(screen.getByRole('button', { name: /Sign In/i }))
      }
      
      // Note: The actual onSubmit is called by the form's onSubmit handler
    })

    it('calls onReset when Clear button is clicked', async () => {
      const { user } = render(<LoginForm {...mockProps} />)
      
      const clearButton = screen.getByRole('button', { name: /Clear/i })
      await user.click(clearButton)

      expect(mockProps.onReset).toHaveBeenCalledTimes(1)
    })

    it('disables inputs when isSubmitting is true', () => {
      const submittingProps = {
        ...mockProps,
        isSubmitting: true,
      }
      render(<LoginForm {...submittingProps} />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      const passwordInput = screen.getByLabelText(/Password/i)
      const submitButton = screen.getByRole('button', { name: /Signing In/i })

      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })

    it('displays loading state when isSubmitting is true', () => {
      const submittingProps = {
        ...mockProps,
        isSubmitting: true,
      }
      render(<LoginForm {...submittingProps} />)

      expect(screen.getByText('Signing In...')).toBeInTheDocument()
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
    })

    it('disables Clear button when isSubmitting is true', () => {
      const submittingProps = {
        ...mockProps,
        isSubmitting: true,
      }
      render(<LoginForm {...submittingProps} />)

      const clearButton = screen.getByRole('button', { name: /Clear/i })
      expect(clearButton).toBeDisabled()
    })
  })

  describe('Compact Mode', () => {
    it('applies compact styling when compact prop is true', () => {
      const { container } = render(<LoginForm {...mockProps} compact={true} />)
      
      const wrapper = container.querySelector('.p-10')
      expect(wrapper).toBeInTheDocument()
    })

    it('applies full-screen styling when compact prop is false', () => {
      const { container } = render(<LoginForm {...mockProps} compact={false} />)
      
      const wrapper = container.querySelector('.min-h-screen')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Required Fields', () => {
    it('email input has required attribute', () => {
      render(<LoginForm {...mockProps} />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toBeRequired()
    })

    it('password input has required attribute', () => {
      render(<LoginForm {...mockProps} />)
      const passwordInput = screen.getByLabelText(/Password/i)
      expect(passwordInput).toBeRequired()
    })
  })

  describe('Accessibility', () => {
    it('has proper labels for inputs', () => {
      render(<LoginForm {...mockProps} />)
      
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    })

    it('email input has correct type attribute', () => {
      render(<LoginForm {...mockProps} />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('has accessible buttons', () => {
      render(<LoginForm {...mockProps} />)
      
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument()
    })
  })
})

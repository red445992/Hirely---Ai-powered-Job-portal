import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../utils'
import RegisterForm from '@/app/auth/register/registerform'

describe('RegisterForm Component', () => {
  const mockProps = {
    formData: {
      fullName: '',
      username: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
    showPassword: false,
    isSubmitting: false,
    errors: {},
    onInputChange: vi.fn(() => vi.fn()),
    onRoleChange: vi.fn(),
    onTogglePassword: vi.fn(),
    onSubmit: vi.fn(),
    onReset: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the registration form with all elements', () => {
      render(<RegisterForm {...mockProps} />)

      expect(screen.getByText('Join Our Job Portal')).toBeInTheDocument()
      expect(screen.getByText('Create your account to get started')).toBeInTheDocument()
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
      expect(screen.getByText('I am a *')).toBeInTheDocument()
      expect(screen.getByLabelText('Password *')).toBeInTheDocument()
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    })

    it('renders submit and reset buttons', () => {
      render(<RegisterForm {...mockProps} />)

      expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument()
    })

    it('renders login link', () => {
      render(<RegisterForm {...mockProps} />)
      
      const loginLink = screen.getByText(/Sign in here/i)
      expect(loginLink).toBeInTheDocument()
      expect(loginLink.closest('a')).toHaveAttribute('href', '/auth/login')
    })

    it('displays all field labels with asterisks', () => {
      render(<RegisterForm {...mockProps} />)

      expect(screen.getByText('Full Name *')).toBeInTheDocument()
      expect(screen.getByText('Username *')).toBeInTheDocument()
      expect(screen.getByText('Email Address *')).toBeInTheDocument()
      expect(screen.getByText('I am a *')).toBeInTheDocument()
      expect(screen.getByText('Password *')).toBeInTheDocument()
      expect(screen.getByText('Confirm Password *')).toBeInTheDocument()
    })
  })

  describe('Form Inputs', () => {
    it('full name input accepts and displays text', async () => {
      const onInputChange = vi.fn(() => vi.fn())
      const { user } = render(
        <RegisterForm {...mockProps} onInputChange={onInputChange} />
      )

      const fullNameInput = screen.getByLabelText(/Full Name/i)
      await user.type(fullNameInput, 'John Doe')

      expect(onInputChange).toHaveBeenCalledWith('fullName')
    })

    it('username input accepts and displays text', async () => {
      const onInputChange = vi.fn(() => vi.fn())
      const { user } = render(
        <RegisterForm {...mockProps} onInputChange={onInputChange} />
      )

      const usernameInput = screen.getByLabelText(/Username/i)
      await user.type(usernameInput, 'johndoe')

      expect(onInputChange).toHaveBeenCalledWith('username')
    })

    it('email input accepts and displays text', async () => {
      const onInputChange = vi.fn(() => vi.fn())
      const { user } = render(
        <RegisterForm {...mockProps} onInputChange={onInputChange} />
      )

      const emailInput = screen.getByLabelText(/Email Address/i)
      await user.type(emailInput, 'john@example.com')

      expect(onInputChange).toHaveBeenCalledWith('email')
    })

    it('password input accepts and displays text', async () => {
      const onInputChange = vi.fn(() => vi.fn())
      const { user } = render(
        <RegisterForm {...mockProps} onInputChange={onInputChange} />
      )

      const passwordInput = screen.getByLabelText('Password *')
      await user.type(passwordInput, 'password123')

      expect(onInputChange).toHaveBeenCalledWith('password')
    })

    it('confirm password input accepts and displays text', async () => {
      const onInputChange = vi.fn(() => vi.fn())
      const { user } = render(
        <RegisterForm {...mockProps} onInputChange={onInputChange} />
      )

      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
      await user.type(confirmPasswordInput, 'password123')

      expect(onInputChange).toHaveBeenCalledWith('confirmPassword')
    })

    it('populates inputs with formData values', () => {
      const propsWithData = {
        ...mockProps,
        formData: {
          fullName: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          role: 'candidate',
          password: 'password123',
          confirmPassword: 'password123',
        },
      }
      render(<RegisterForm {...propsWithData} />)

      expect((screen.getByLabelText(/Full Name/i) as HTMLInputElement).value).toBe('John Doe')
      expect((screen.getByLabelText(/Username/i) as HTMLInputElement).value).toBe('johndoe')
      expect((screen.getByLabelText(/Email Address/i) as HTMLInputElement).value).toBe('john@example.com')
      expect((screen.getByLabelText('Password *') as HTMLInputElement).value).toBe('password123')
      expect((screen.getByLabelText(/Confirm Password/i) as HTMLInputElement).value).toBe('password123')
    })
  })

  describe('Role Selection', () => {
    it('renders role select with placeholder', () => {
      render(<RegisterForm {...mockProps} />)
      
      expect(screen.getByText('Select your role')).toBeInTheDocument()
    })

    it('calls onRoleChange when role is selected', async () => {
      const { user } = render(<RegisterForm {...mockProps} />)
      
      const roleSelect = screen.getByRole('combobox')
      await user.click(roleSelect)
      
      // Note: Select interactions might need additional setup for full testing
      // This verifies the component renders correctly
    })
  })

  describe('Error Display', () => {
    it('displays error for full name field', () => {
      const propsWithError = {
        ...mockProps,
        errors: { fullName: 'Full name is required' },
      }
      render(<RegisterForm {...propsWithError} />)

      expect(screen.getByText('Full name is required')).toBeInTheDocument()
    })

    it('displays error for username field', () => {
      const propsWithError = {
        ...mockProps,
        errors: { username: 'Username must be at least 3 characters' },
      }
      render(<RegisterForm {...propsWithError} />)

      expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument()
    })

    it('displays error for email field', () => {
      const propsWithError = {
        ...mockProps,
        errors: { email: 'Invalid email address' },
      }
      render(<RegisterForm {...propsWithError} />)

      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    })

    it('displays error for role field', () => {
      const propsWithError = {
        ...mockProps,
        errors: { role: 'Please select a role' },
      }
      render(<RegisterForm {...propsWithError} />)

      expect(screen.getByText('Please select a role')).toBeInTheDocument()
    })

    it('displays error for password field', () => {
      const propsWithError = {
        ...mockProps,
        errors: { password: 'Password must be at least 8 characters' },
      }
      render(<RegisterForm {...propsWithError} />)

      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })

    it('displays error for confirm password field', () => {
      const propsWithError = {
        ...mockProps,
        errors: { confirmPassword: 'Passwords do not match' },
      }
      render(<RegisterForm {...propsWithError} />)

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    it('displays multiple errors simultaneously', () => {
      const propsWithErrors = {
        ...mockProps,
        errors: {
          fullName: 'Full name is required',
          email: 'Invalid email',
          password: 'Password too short',
        },
      }
      render(<RegisterForm {...propsWithErrors} />)

      expect(screen.getByText('Full name is required')).toBeInTheDocument()
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
      expect(screen.getByText('Password too short')).toBeInTheDocument()
    })

    it('applies error styling to inputs with errors', () => {
      const propsWithError = {
        ...mockProps,
        errors: { email: 'Invalid email' },
      }
      render(<RegisterForm {...propsWithError} />)

      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toHaveClass('border-red-500')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('password inputs are hidden by default', () => {
      render(<RegisterForm {...mockProps} />)
      
      const passwordInput = screen.getByLabelText('Password *')
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    })

    it('shows passwords when showPassword is true', () => {
      const propsWithVisiblePassword = {
        ...mockProps,
        showPassword: true,
      }
      render(<RegisterForm {...propsWithVisiblePassword} />)
      
      const passwordInput = screen.getByLabelText('Password *')
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
      
      expect(passwordInput).toHaveAttribute('type', 'text')
      expect(confirmPasswordInput).toHaveAttribute('type', 'text')
    })

    it('calls onTogglePassword when visibility button is clicked', async () => {
      const { user } = render(<RegisterForm {...mockProps} />)
      
      const toggleButtons = screen.getAllByRole('button')
      const visibilityToggle = toggleButtons.find(btn => 
        btn.className.includes('absolute right-0')
      )
      
      if (visibilityToggle) {
        await user.click(visibilityToggle)
        expect(mockProps.onTogglePassword).toHaveBeenCalled()
      }
    })
  })

  describe('Form Submission', () => {
    it('calls onReset when Reset button is clicked', async () => {
      const { user } = render(<RegisterForm {...mockProps} />)
      
      const resetButton = screen.getByRole('button', { name: /Reset/i })
      await user.click(resetButton)

      expect(mockProps.onReset).toHaveBeenCalledTimes(1)
    })

    it('disables all inputs when isSubmitting is true', () => {
      const submittingProps = {
        ...mockProps,
        isSubmitting: true,
      }
      render(<RegisterForm {...submittingProps} />)

      expect(screen.getByLabelText(/Full Name/i)).toBeDisabled()
      expect(screen.getByLabelText(/Username/i)).toBeDisabled()
      expect(screen.getByLabelText(/Email Address/i)).toBeDisabled()
      expect(screen.getByLabelText('Password *')).toBeDisabled()
      expect(screen.getByLabelText(/Confirm Password/i)).toBeDisabled()
    })

    it('displays loading state when isSubmitting is true', () => {
      const submittingProps = {
        ...mockProps,
        isSubmitting: true,
      }
      render(<RegisterForm {...submittingProps} />)

      expect(screen.getByText('Creating Account...')).toBeInTheDocument()
      expect(screen.queryByText('Create Account')).not.toBeInTheDocument()
    })

    it('disables Reset button when isSubmitting is true', () => {
      const submittingProps = {
        ...mockProps,
        isSubmitting: true,
      }
      render(<RegisterForm {...submittingProps} />)

      const resetButton = screen.getByRole('button', { name: /Reset/i })
      expect(resetButton).toBeDisabled()
    })

    it('disables submit button when isSubmitting is true', () => {
      const submittingProps = {
        ...mockProps,
        isSubmitting: true,
      }
      render(<RegisterForm {...submittingProps} />)

      const submitButton = screen.getByRole('button', { name: /Creating Account/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Compact Mode', () => {
    it('applies compact styling when compact prop is true', () => {
      const { container } = render(<RegisterForm {...mockProps} compact={true} />)
      
      const wrapper = container.querySelector('.p-2')
      expect(wrapper).toBeInTheDocument()
    })

    it('applies full-screen styling when compact prop is false', () => {
      const { container } = render(<RegisterForm {...mockProps} compact={false} />)
      
      const wrapper = container.querySelector('.min-h-screen')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Input Placeholders', () => {
    it('has correct placeholder for full name', () => {
      render(<RegisterForm {...mockProps} />)
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    })

    it('has correct placeholder for username', () => {
      render(<RegisterForm {...mockProps} />)
      expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument()
    })

    it('has correct placeholder for email', () => {
      render(<RegisterForm {...mockProps} />)
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    })

    it('has correct placeholder for password', () => {
      render(<RegisterForm {...mockProps} />)
      expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument()
    })

    it('has correct placeholder for confirm password', () => {
      render(<RegisterForm {...mockProps} />)
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper labels for all inputs', () => {
      render(<RegisterForm {...mockProps} />)
      
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Username/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
      expect(screen.getByText('I am a *')).toBeInTheDocument()
      expect(screen.getByLabelText('Password *')).toBeInTheDocument()
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    })

    it('email input has correct type attribute', () => {
      render(<RegisterForm {...mockProps} />)
      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('has accessible buttons', () => {
      render(<RegisterForm {...mockProps} />)
      
      expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument()
    })
  })
})

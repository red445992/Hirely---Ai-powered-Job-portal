import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

/**
 * Custom render function with userEvent setup
 */
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { ...options })
  }
}

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

/**
 * Mock fetch for API calls
 */
export function mockFetch(data: any, status = 200) {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
    } as Response)
  )
}

/**
 * Mock successful API response
 */
export function mockSuccessResponse(data: any) {
  return mockFetch(data, 200)
}

/**
 * Mock error API response
 */
export function mockErrorResponse(message: string, status = 400) {
  return mockFetch({ error: message }, status)
}

/**
 * Wait for async operations to complete
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Re-export testing library utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { vi }

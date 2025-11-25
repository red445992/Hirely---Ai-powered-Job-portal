import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Components', () => {
  it('renders card with all sections', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Card Content')).toBeInTheDocument()
    expect(screen.getByText('Card Footer')).toBeInTheDocument()
  })

  it('renders card without header', () => {
    render(
      <Card>
        <CardContent>Just content</CardContent>
      </Card>
    )

    expect(screen.getByText('Just content')).toBeInTheDocument()
  })

  it('renders card without footer', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title Only</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )

    expect(screen.getByText('Title Only')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies custom className to card', () => {
    render(
      <Card className="custom-card" data-testid="card">
        <CardContent>Content</CardContent>
      </Card>
    )

    expect(screen.getByTestId('card')).toHaveClass('custom-card')
  })
})

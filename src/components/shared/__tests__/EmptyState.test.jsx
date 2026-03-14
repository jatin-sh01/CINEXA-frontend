import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmptyState from '../EmptyState';
import { FiFilm } from 'react-icons/fi';

describe('EmptyState Component', () => {
  test('renders nothing when no props are passed', () => {
    const { container } = render(<EmptyState />);
    expect(container.firstChild).toHaveClass('bg-gray-50');
  });

  test('renders title when provided', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    const description = 'Try adjusting your filters or search query.';
    render(<EmptyState description={description} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  test('renders icon when provided', () => {
    render(<EmptyState icon={<FiFilm data-testid="test-icon" />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('renders action button when provided', () => {
    const actionButton = <button>Browse all movies</button>;
    render(<EmptyState action={actionButton} />);
    expect(screen.getByRole('button', { name: 'Browse all movies' })).toBeInTheDocument();
  });

  test('renders with all props together', () => {
    const props = {
      icon: <FiFilm data-testid="empty-icon" />,
      title: 'No bookings yet',
      description: 'Start booking your favorite movies!',
      action: <button>Browse Movies</button>,
    };
    
    render(<EmptyState {...props} />);
    
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    expect(screen.getByText('No bookings yet')).toBeInTheDocument();
    expect(screen.getByText('Start booking your favorite movies!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Movies' })).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    const { container } = render(
      <EmptyState title="Test" description="Description" />
    );
    
    const emptyStateDiv = container.firstChild;
    expect(emptyStateDiv).toHaveClass('bg-gray-50', 'border', 'border-gray-200', 'rounded-xl', 'p-12', 'text-center');
  });

  test('renders with long title and description', () => {
    const longTitle = 'This is a very long title that might wrap ' + 'x'.repeat(150);
    const longDesc = 'This is a very long description ' + 'y'.repeat(200);
    
    render(<EmptyState title={longTitle} description={longDesc} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  test('handles React components as children in action', () => {
    const ComplexAction = () => (
      <div>
        <button>Option 1</button>
        <button>Option 2</button>
      </div>
    );
    
    render(<EmptyState action={<ComplexAction />} />);
    
    expect(screen.getByRole('button', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Option 2' })).toBeInTheDocument();
  });
});

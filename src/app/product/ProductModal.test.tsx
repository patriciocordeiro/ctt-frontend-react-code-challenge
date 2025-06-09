import { fireEvent, render, screen } from '@testing-library/react';
import { ProductModal } from './ProductModal';

describe('ProductModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ProductModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title='Test Modal'></ProductModal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should render with title, form placeholder, and action buttons when isOpen is true', () => {
    render(
      <ProductModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title='Create New Product'
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /create new product/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Actual form fields will go here.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create product/i })
    ).toBeInTheDocument();
  });

  it('should call onClose when the Cancel button is clicked', () => {
    render(
      <ProductModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title='Test Modal'></ProductModal>
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the overlay is clicked (if overlay exists and is clickable)', () => {
    render(
      <ProductModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title='Test Modal'></ProductModal>
    );

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

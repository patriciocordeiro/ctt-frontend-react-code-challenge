import { fireEvent, render, screen } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const title = 'Confirm Delete';
  const message = 'Are you sure you want to delete this item?';

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ConfirmationModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title={title}>
        {message}
      </ConfirmationModal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render with title, message (children), and action buttons when isOpen is true', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title={title}>
        {message}
      </ConfirmationModal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /confirm/i })
    ).toBeInTheDocument();
  });

  it('should call onClose when the Cancel button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title={title}>
        {message}
      </ConfirmationModal>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onClose when the overlay is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title={title}>
        {message}
      </ConfirmationModal>
    );
    fireEvent.click(screen.getByTestId('confirmation-modal-overlay'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm and then onClose when the Confirm button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title={title}>
        {message}
      </ConfirmationModal>
    );
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

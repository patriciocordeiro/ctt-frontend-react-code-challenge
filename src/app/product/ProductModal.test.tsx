import { act, fireEvent, render, screen } from '@testing-library/react';
import { NewProductData } from '../../store/product/product.types';
import { ProductModal } from './ProductModal';

describe('ProductModal Component', () => {
  let mockOnClose: jest.Mock<void, []> = jest.fn();
  let mockOnSubmit = jest.fn() as jest.Mock<Promise<void>, [NewProductData]>;
  let mockSubmitPromise: Promise<void>;

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    title: 'Test Modal Title',
  };

  const renderModal = (props = {}) => {
    return render(<ProductModal {...defaultProps} {...props} />);
  };

  const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Super Gadget' },
    });
    fireEvent.change(screen.getByLabelText(/stock/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: '49.95' },
    });
    fireEvent.change(screen.getByLabelText(/categories/i), {
      target: { value: 'tech, cool' },
    });
  };

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockSubmitPromise = Promise.resolve();
    mockOnSubmit = jest.fn<Promise<void>, [NewProductData]>(
      () => mockSubmitPromise
    );
    defaultProps.onClose = mockOnClose;
    defaultProps.onSubmit = mockOnSubmit;
    jest.restoreAllMocks();
  });

  describe('Rendering and Basic Interactions', () => {
    it('should not render when isOpen is false', () => {
      renderModal({ isOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render with title and action buttons when isOpen is true', () => {
      renderModal({ title: 'Create New Product' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /create new product/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create product/i })
      ).toBeInTheDocument();
    });

    it('should call onClose when the Cancel button is clicked', () => {
      renderModal();
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when the overlay is clicked', () => {
      renderModal();
      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Fields and Input Handling', () => {
    it('should render input fields for product details', () => {
      renderModal();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categories/i)).toBeInTheDocument();
    });

    it('should update description field on input', () => {
      renderModal();
      const descriptionInput = screen.getByLabelText(
        /description/i
      ) as HTMLInputElement;
      fireEvent.change(descriptionInput, {
        target: { value: 'New Test Product' },
      });
      expect(descriptionInput.value).toBe('New Test Product');
    });

    it('should update stock field on input', () => {
      renderModal();
      const stockInput = screen.getByLabelText(/stock/i) as HTMLInputElement;
      fireEvent.change(stockInput, { target: { value: '123' } });
      expect(stockInput.value).toBe('123');
    });

    it('should update price field on input', () => {
      renderModal();
      const priceInput = screen.getByLabelText(/price/i) as HTMLInputElement;
      fireEvent.change(priceInput, { target: { value: '99.99' } });
      expect(priceInput.value).toBe('99.99');
    });

    it('should update categories field on input', () => {
      renderModal();
      const categoriesInput = screen.getByLabelText(
        /categories/i
      ) as HTMLInputElement;
      fireEvent.change(categoriesInput, { target: { value: 'catA,catB' } });
      expect(categoriesInput.value).toBe('catA,catB');
    });
  });

  describe('Form Submission, Submitting State, and Error Handling', () => {
    it('should show "Saving...", disable form/buttons, call onSubmit, then call onClose on successful submission', async () => {
      mockSubmitPromise = Promise.resolve();
      renderModal();
      fillValidForm();
      const createButton = screen.getByRole('button', {
        name: /create product/i,
      });
      fireEvent.click(createButton);

      expect(
        screen.getByRole('button', { name: /saving.../i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      expect(
        screen.getByLabelText(/description/i).closest('fieldset')
      ).toBeDisabled();
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Super Gadget',
        stock: 100,
        price: 49.95,
        categories: ['tech', 'cool'],
      });

      await act(async () => {
        await mockSubmitPromise;
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(
        screen.queryByRole('button', { name: /saving.../i })
      ).not.toBeInTheDocument();
    });

    it('should show "Saving...", then an error message inside modal, and not call onClose if onSubmit rejects', async () => {
      const submissionErrorMessage = 'API submission failed!';
      mockSubmitPromise = Promise.reject(new Error(submissionErrorMessage));
      renderModal();
      fillValidForm();
      const createButton = screen.getByRole('button', {
        name: /create product/i,
      });
      fireEvent.click(createButton);

      expect(
        screen.getByRole('button', { name: /saving.../i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled();

      await act(async () => {
        try {
          await mockSubmitPromise;
        } catch (e) {
          /* empty */
        }
      });

      expect(await screen.findByRole('alert')).toHaveTextContent(
        submissionErrorMessage
      );
      expect(mockOnClose).not.toHaveBeenCalled();
      expect(
        screen.getByRole('button', { name: /create product/i })
      ).toBeEnabled();
      expect(
        screen.getByLabelText(/description/i).closest('fieldset')
      ).not.toBeDisabled();
      expect(
        (screen.getByLabelText(/description/i) as HTMLInputElement).value
      ).toBe('Super Gadget');
    });

    it('should show client-side validation alert and not call onSubmit if required fields are missing', () => {
      renderModal();
      const alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Please fill in all required fields')
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });
  });
});

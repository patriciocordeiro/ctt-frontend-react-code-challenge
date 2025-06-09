import { fireEvent, render, screen } from '@testing-library/react';
import { NewProductData } from '../../store/product/product.types';
import { ProductModal } from './ProductModal';

describe('ProductModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn() as jest.Mock<void, [NewProductData]>;

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    title: 'Test Modal Title',
  };

  const renderModal = (props = {}) => {
    return render(<ProductModal {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
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

  describe('Form Submission and Validation', () => {
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
        target: { value: 'tech, cool, gadget' },
      });
    };

    it('should call onSubmit with correct data when form is valid and submitted', () => {
      renderModal();
      fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Super Gadget',
        stock: 100,
        price: 49.95,
        categories: ['tech', 'cool', 'gadget'],
      });
    });

    it('should show an alert and not call onSubmit if description is missing', () => {
      renderModal();
      const alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
      fireEvent.change(screen.getByLabelText(/stock/i), {
        target: { value: '10' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '10' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Please fill in all required fields')
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should show an alert and not call onSubmit if stock is missing', () => {
      renderModal();
      const alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Valid Desc' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '10' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Please fill in all required fields')
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should show an alert and not call onSubmit if price is missing', () => {
      renderModal();
      const alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Valid Desc' },
      });
      fireEvent.change(screen.getByLabelText(/stock/i), {
        target: { value: '10' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Please fill in all required fields')
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should show an alert for invalid (negative) stock value', () => {
      renderModal();
      const alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
      fillValidForm();
      fireEvent.change(screen.getByLabelText(/stock/i), {
        target: { value: '-5' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(alertSpy).toHaveBeenCalledWith(
        'Stock must be a non-negative number.'
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });
    it('should show an alert for non-numeric price value', () => {
      renderModal();
      const alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Super Gadget' },
      });
      fireEvent.change(screen.getByLabelText(/stock/i), {
        target: { value: '100' },
      });
      fireEvent.change(screen.getByLabelText(/categories/i), {
        target: { value: 'tech, cool, gadget' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: -10 },
      });
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(alertSpy).toHaveBeenCalledWith(
        'Price must be a non-negative number.'
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should correctly parse categories, trimming spaces and filtering empty strings', () => {
      renderModal();
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Test' },
      });
      fireEvent.change(screen.getByLabelText(/stock/i), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByLabelText(/categories/i), {
        target: { value: '  cat1  , cat2 ,, cat3  , ' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: ['cat1', 'cat2', 'cat3'],
        })
      );
    });

    it('should submit with empty categories array if categories input is empty', () => {
      renderModal();
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Test' },
      });
      fireEvent.change(screen.getByLabelText(/stock/i), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByLabelText(/categories/i), {
        target: { value: '' },
      });
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: [],
        })
      );
    });
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { Product } from '../../models/product.model';
import { NewProductData } from '../../store/product/product.types';
import { ProductModal } from './ProductModal';

describe('ProductModal Component', () => {
  let mockOnClose: jest.Mock<void, []> = jest.fn();
  let mockOnSubmit: jest.Mock<(formData: NewProductData, id?: string) => void> =
    jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    title: 'Test Modal Title',
    saveLoading: false,
    initialData: undefined as Product | null | undefined,
    editingId: undefined as string | undefined,
  };

  const renderModal = (props: Partial<typeof defaultProps> = {}) => {
    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
    const currentProps = {
      ...defaultProps,
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      saveLoading:
        props.saveLoading !== undefined
          ? props.saveLoading
          : defaultProps.saveLoading,
      isOpen: props.isOpen !== undefined ? props.isOpen : defaultProps.isOpen,
      title: props.title !== undefined ? props.title : defaultProps.title,
      initialData:
        props.initialData !== undefined
          ? props.initialData === null
            ? undefined
            : props.initialData
          : defaultProps.initialData === null
          ? undefined
          : defaultProps.initialData,
      editingId:
        props.editingId !== undefined
          ? props.editingId
          : defaultProps.editingId,
    };
    return render(<ProductModal {...currentProps} />);
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
    jest.restoreAllMocks();
  });

  describe('Rendering and Basic Interactions', () => {
    it('should not render when isOpen is false', () => {
      renderModal({ isOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render with title and action buttons when isOpen is true for create mode', () => {
      renderModal({ title: 'Create New Product', editingId: undefined });
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

    it('should render with "Save Changes" button in edit mode', () => {
      renderModal({ title: 'Edit Product', editingId: '123' });
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).toBeInTheDocument();
    });

    it('should call onClose when the Cancel button is clicked', () => {
      renderModal();
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when the overlay is clicked (and not saveLoading)', () => {
      renderModal({ saveLoading: false });
      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onClose when the overlay is clicked and saveLoading is true', () => {
      renderModal({ saveLoading: true });
      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Form Fields and Input Handling', () => {
    beforeEach(() => {
      renderModal();
    });

    it('should render input fields for product details', () => {
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categories/i)).toBeInTheDocument();
    });

    it('should update description field on input', () => {
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

  describe('Form Submission, saveLoading Prop, and Client Validation', () => {
    it('should call onSubmit with form data when "Create Product" button is clicked and saveLoading is false', () => {
      renderModal({
        title: 'Create Product',
        saveLoading: false,
        editingId: undefined,
      });
      fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit.mock.calls[0][0]).toEqual({
        description: 'Super Gadget',
        stock: 100,
        price: 49.95,
        categories: ['tech', 'cool'],
      });
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should display "Saving..." text and disable form/buttons when saveLoading prop is true', () => {
      renderModal({
        title: 'Create Product',
        saveLoading: true,
        editingId: undefined,
      });
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /saving.../i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      expect(
        screen.getByLabelText(/description/i).closest('fieldset')
      ).toBeDisabled();
    });

    it('should display "Save Changes" button text and be enabled when saveLoading is false in edit mode', () => {
      renderModal({
        title: 'Edit Product',
        saveLoading: false,
        editingId: '123',
      });
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).toBeEnabled();
    });

    it('should show client-side validation alert (window.alert) and not call onSubmit if required fields are missing', () => {
      renderModal({ saveLoading: false });
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

    it('should show client-side alert for invalid stock and not call onSubmit', () => {
      renderModal({ saveLoading: false });
      const alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Valid Desc' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: 10.0 },
      });
      fireEvent.change(screen.getByLabelText(/stock/i), {
        target: { value: -5 },
      }); // Invalid
      fireEvent.click(screen.getByRole('button', { name: /create product/i }));
      expect(alertSpy).toHaveBeenCalledWith(
        'Stock must be a non-negative number.'
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });
  });
});

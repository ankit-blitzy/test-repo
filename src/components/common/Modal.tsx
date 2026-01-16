import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props interface for the Modal component.
 * Defines the configuration options for modal dialog behavior and appearance.
 */
export interface ModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Callback function triggered when modal should close */
  onClose: () => void;
  /** Optional title displayed in the modal header */
  title?: string;
  /** Content to render inside the modal body */
  children: ReactNode;
  /** Optional additional CSS classes for the modal panel */
  className?: string;
}

/**
 * Modal dialog overlay component for displaying content in a floating panel above the page.
 * 
 * Features:
 * - Backdrop overlay with click-to-close functionality
 * - Centered content panel with smooth transitions
 * - Close button and Escape key support
 * - Customizable title and children content
 * - Body scroll lock when open
 * - Portal rendering for proper stacking context
 * - Accessible with proper ARIA attributes and focus management
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: ModalProps): React.ReactPortal | null {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle Escape key press and body scroll lock
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      // Store the currently focused element to restore later
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add event listener for Escape key
      document.addEventListener('keydown', handleEscape);
      
      // Lock body scroll
      document.body.classList.add('overflow-hidden');
      
      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('overflow-hidden');
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  /**
   * Handles click events on the overlay backdrop.
   * Closes the modal if the click target is the overlay itself.
   */
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  /**
   * Prevents click events inside the modal from propagating to the overlay.
   */
  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  };

  // Don't render anything if the modal is not open
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <>
      {/* Backdrop overlay with blur effect */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        aria-hidden="true"
      />
      
      {/* Modal container for centering */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Modal panel */}
        <div
          ref={modalRef}
          onClick={handleModalClick}
          tabIndex={-1}
          className={`
            bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto
            transform transition-all duration-200 ease-out
            animate-in fade-in zoom-in-95
            ${className}
          `.trim().replace(/\s+/g, ' ')}
        >
          {/* Header with title and close button */}
          <div className="flex items-center justify-between p-4 border-b border-stone-200">
            {title ? (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-stone-900"
              >
                {title}
              </h2>
            ) : (
              <div /> // Empty div to maintain flex spacing when no title
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  // Render modal content into document.body using portal
  return createPortal(modalContent, document.body);
}

export default Modal;

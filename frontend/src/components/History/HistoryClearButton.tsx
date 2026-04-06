import { useState, useCallback, useEffect } from 'react'

/**
 * Props for the HistoryClearButton component.
 *
 * @property onClear - Callback invoked when the user confirms the clear action.
 *   Supports both synchronous and asynchronous operations (e.g., API DELETE call).
 *   The parent (HistoryPanel) passes `history.clearAll()` which calls
 *   `DELETE /api/history` to remove all calculation history entries.
 */
interface HistoryClearButtonProps {
  onClear: () => void | Promise<void>
}

/**
 * HistoryClearButton — Destructive action button with two-step confirmation.
 *
 * Implements a two-step confirmation pattern to prevent accidental deletion
 * of all calculation history entries:
 *
 * **Step 1 (Default):** Displays a subtle "Clear All" button.
 * **Step 2 (Confirming):** Replaces the button inline with a "Clear all?" prompt
 * and "Yes" / "No" buttons. The confirmation state auto-resets after 5 seconds
 * of inactivity to prevent stale confirmation prompts.
 *
 * Per AAP Section 0.5.1 Group 6: "Destructive action button with confirmation
 * dialog to clear all history entries."
 *
 * Per AAP Section 0.5.3 History Panel UI: "'Clear All' button at the top with
 * confirmation dialog."
 *
 * @param props - Component props containing the onClear callback.
 * @returns The rendered HistoryClearButton component.
 */
export default function HistoryClearButton({ onClear }: HistoryClearButtonProps) {
  const [isConfirming, setIsConfirming] = useState<boolean>(false)

  /**
   * Auto-cancel timer: resets confirmation state after 5 seconds of inactivity.
   * Prevents the confirmation prompt from persisting indefinitely if the user
   * clicks "Clear All" but does not follow through with a confirm or cancel action.
   * The cleanup function clears the timer on unmount or when isConfirming changes.
   */
  useEffect(() => {
    if (isConfirming) {
      const timer = setTimeout(() => {
        setIsConfirming(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isConfirming])

  /**
   * Transitions from the default state to the confirmation state.
   * Shows the "Clear all?" prompt with "Yes" and "No" buttons.
   */
  const handleInitialClick = useCallback(() => {
    setIsConfirming(true)
  }, [])

  /**
   * Confirms the destructive action: calls the parent's onClear callback
   * (which invokes the DELETE /api/history endpoint) and resets the
   * confirmation state. Uses async/await to support Promise<void> returns.
   */
  const handleConfirm = useCallback(async () => {
    await onClear()
    setIsConfirming(false)
  }, [onClear])

  /**
   * Cancels the destructive action: reverts the component back to the
   * default "Clear All" button state without invoking onClear.
   */
  const handleCancel = useCallback(() => {
    setIsConfirming(false)
  }, [])

  return (
    <div className="inline-flex items-center">
      {!isConfirming ? (
        <button
          type="button"
          onClick={handleInitialClick}
          className="px-2 py-1 text-xs font-medium rounded text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors duration-150"
          aria-label="Clear all calculation history"
          title="Clear all history"
        >
          Clear All
        </button>
      ) : (
        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label="Confirm clear history"
        >
          <span className="text-xs text-red-400">Clear all?</span>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-2 py-0.5 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-500 transition-colors duration-150"
            aria-label="Confirm clear all history"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-2 py-0.5 text-xs font-medium rounded bg-calculator-key-default text-calculator-text-dim hover:bg-calculator-key-default/80 transition-colors duration-150"
            aria-label="Cancel clear history"
          >
            No
          </button>
        </div>
      )}
    </div>
  )
}

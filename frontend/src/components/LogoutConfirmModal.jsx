import { useEffect, useRef } from 'react'

const LogoutConfirmModal = ({ onClose, onConfirm }) => {
  const cancelRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Focus Cancel by default for safety
    if (cancelRef.current) cancelRef.current.focus()
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
    >
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-xl">
        {/* Icon + Title */}
        <div className="flex items-center gap-sm mb-lg">
          <span className="material-symbols-outlined text-3xl text-primary" aria-hidden="true">
            logout
          </span>
          <h2 id="logout-confirm-title" className="font-headline-md text-headline-md text-on-surface">
            Confirm Logout
          </h2>
        </div>

        {/* Message */}
        <p className="text-body-md text-on-surface-variant mb-lg">
          Are you sure you want to log out? You will need to sign in again to continue.
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-md">
          <button
            ref={cancelRef}
            onClick={onClose}
            className="w-full sm:w-auto px-xl py-sm border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-xl py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmModal

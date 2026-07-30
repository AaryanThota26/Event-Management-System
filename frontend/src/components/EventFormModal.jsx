import { useState, useEffect, useRef } from 'react'

const initialFormState = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  capacity: '',
}

const EventFormModal = ({ event, onClose, onSubmit, submitting }) => {
  const isEditing = !!event

  const [form, setForm] = useState(() => {
    if (event) {
      return {
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        capacity: event.capacity != null ? String(event.capacity) : '',
      }
    }
    return { ...initialFormState }
  })

  const [errors, setErrors] = useState({})

  // Focus trap: focus first input on mount
  const firstInputRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    // Focus the first input when modal opens
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }
    // Lock body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, submitting])

  const validate = () => {
    const errs = {}
    if (!form.title.trim() || form.title.trim().length < 3)
      errs.title = 'Title must be at least 3 characters.'
    if (!form.description.trim() || form.description.trim().length < 10)
      errs.description = 'Description must be at least 10 characters.'
    if (!form.date) errs.date = 'Date is required.'
    if (!form.time) errs.time = 'Time is required.'
    if (!form.location.trim() || form.location.trim().length < 2)
      errs.location = 'Location must be at least 2 characters.'
    const cap = parseInt(form.capacity, 10)
    if (!cap || cap < 1) errs.capacity = 'Capacity must be at least 1.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      capacity: parseInt(form.capacity, 10),
    })
  }

  const inputClass = (field) =>
    `w-full px-md py-sm bg-white border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm transition-all shadow-sm ${
      errors[field] ? 'border-error' : 'border-outline-variant'
    }`

  const modalTitleId = isEditing ? 'edit-event-title' : 'create-event-title'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      ref={modalRef}
    >
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-xl pt-xl pb-md border-b border-outline-variant">
          <h2 id={modalTitleId} className="font-headline-md text-headline-md text-on-surface">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="material-symbols-outlined p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Close modal"
          >
            close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-xl py-lg space-y-lg" noValidate>
          {/* Title */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="event-title">
              Title <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="event-title"
              className={inputClass('title')}
              placeholder="Event title"
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              aria-invalid={errors.title ? 'true' : undefined}
              aria-describedby={errors.title ? 'event-title-error' : undefined}
            />
            {errors.title && (
              <p id="event-title-error" className="text-body-sm text-error mt-xs flex items-center gap-xs" role="alert">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">error</span>
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="event-description">
              Description <span className="text-error" aria-hidden="true">*</span>
            </label>
            <textarea
              id="event-description"
              className={`${inputClass('description')} min-h-[100px] resize-y`}
              placeholder="Detailed description of the event"
              value={form.description}
              onChange={handleChange('description')}
              aria-invalid={errors.description ? 'true' : undefined}
              aria-describedby={errors.description ? 'event-description-error' : undefined}
            />
            {errors.description && (
              <p id="event-description-error" className="text-body-sm text-error mt-xs flex items-center gap-xs" role="alert">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">error</span>
                {errors.description}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="event-date">
                Date <span className="text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="event-date"
                className={inputClass('date')}
                type="date"
                value={form.date}
                onChange={handleChange('date')}
                aria-invalid={errors.date ? 'true' : undefined}
                aria-describedby={errors.date ? 'event-date-error' : undefined}
              />
              {errors.date && (
                <p id="event-date-error" className="text-body-sm text-error mt-xs flex items-center gap-xs" role="alert">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">error</span>
                  {errors.date}
                </p>
              )}
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="event-time">
                Time <span className="text-error" aria-hidden="true">*</span>
              </label>
              <input
                id="event-time"
                className={inputClass('time')}
                type="time"
                value={form.time}
                onChange={handleChange('time')}
                aria-invalid={errors.time ? 'true' : undefined}
                aria-describedby={errors.time ? 'event-time-error' : undefined}
              />
              {errors.time && (
                <p id="event-time-error" className="text-body-sm text-error mt-xs flex items-center gap-xs" role="alert">
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">error</span>
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="event-location">
              Location <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="event-location"
              className={inputClass('location')}
              placeholder="Venue or online link"
              type="text"
              value={form.location}
              onChange={handleChange('location')}
              aria-invalid={errors.location ? 'true' : undefined}
              aria-describedby={errors.location ? 'event-location-error' : undefined}
            />
            {errors.location && (
              <p id="event-location-error" className="text-body-sm text-error mt-xs flex items-center gap-xs" role="alert">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">error</span>
                {errors.location}
              </p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="event-capacity">
              Capacity <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="event-capacity"
              className={inputClass('capacity')}
              placeholder="Maximum attendees"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange('capacity')}
              aria-invalid={errors.capacity ? 'true' : undefined}
              aria-describedby={errors.capacity ? 'event-capacity-error' : undefined}
            />
            {errors.capacity && (
              <p id="event-capacity-error" className="text-body-sm text-error mt-xs flex items-center gap-xs" role="alert">
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">error</span>
                {errors.capacity}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-md pt-md border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-xl py-sm border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-xl py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting && (
                <span className="material-symbols-outlined animate-spin text-[18px]" aria-hidden="true">sync</span>
              )}
              {isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventFormModal

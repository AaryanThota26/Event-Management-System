import { useState } from 'react'

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-xl pt-xl pb-md border-b border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="material-symbols-outlined p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-xl py-lg space-y-lg">
          {/* Title */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">
              Title
            </label>
            <input
              className={inputClass('title')}
              placeholder="Event title"
              type="text"
              value={form.title}
              onChange={handleChange('title')}
            />
            {errors.title && (
              <p className="text-body-sm text-error mt-xs">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">
              Description
            </label>
            <textarea
              className={`${inputClass('description')} min-h-[100px] resize-y`}
              placeholder="Detailed description of the event"
              value={form.description}
              onChange={handleChange('description')}
            />
            {errors.description && (
              <p className="text-body-sm text-error mt-xs">{errors.description}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs">
                Date
              </label>
              <input
                className={inputClass('date')}
                type="date"
                value={form.date}
                onChange={handleChange('date')}
              />
              {errors.date && (
                <p className="text-body-sm text-error mt-xs">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs">
                Time
              </label>
              <input
                className={inputClass('time')}
                type="time"
                value={form.time}
                onChange={handleChange('time')}
              />
              {errors.time && (
                <p className="text-body-sm text-error mt-xs">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">
              Location
            </label>
            <input
              className={inputClass('location')}
              placeholder="Venue or online link"
              type="text"
              value={form.location}
              onChange={handleChange('location')}
            />
            {errors.location && (
              <p className="text-body-sm text-error mt-xs">{errors.location}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-xs">
              Capacity
            </label>
            <input
              className={inputClass('capacity')}
              placeholder="Maximum attendees"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange('capacity')}
            />
            {errors.capacity && (
              <p className="text-body-sm text-error mt-xs">{errors.capacity}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-md pt-md border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-xl py-sm border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-xl py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-sm"
              disabled={submitting}
            >
              {submitting && (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
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

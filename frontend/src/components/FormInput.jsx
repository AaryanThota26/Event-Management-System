import { useState } from 'react'

const FormInput = ({
  id,
  label,
  type = 'text',
  icon,
  placeholder,
  required = false,
  rightElement,
  value,
  onChange,
  error,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="space-y-xs">
      {label && (
        <div className="flex justify-between items-center">
          <label
            className="font-label-md text-label-md text-on-surface"
            htmlFor={id}
          >
            {label}
            {required && (
              <span className="text-error ml-xs" aria-hidden="true">*</span>
            )}
          </label>
          {rightElement}
        </div>
      )}
      <div className="relative group">
        {icon && (
          <span
            className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors pointer-events-none"
            style={{
              fontVariationSettings: isFocused
                ? "'FILL' 1"
                : "'FILL' 0",
            }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          className={`w-full pl-[48px] pr-md py-md bg-surface-container-lowest border rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
            error ? 'border-error' : 'border-outline-variant'
          }`}
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          aria-required={required ? 'true' : undefined}
          autoComplete={autoComplete}
        />
      </div>
      {error && (
        <p
          id={errorId}
          className="text-body-sm text-error mt-xs flex items-center gap-xs"
          role="alert"
        >
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormInput

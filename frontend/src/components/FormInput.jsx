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
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-xs">
      {label && (
        <div className="flex justify-between items-center">
          <label
            className="font-label-md text-label-md text-on-surface"
            htmlFor={id}
          >
            {label}
          </label>
          {rightElement}
        </div>
      )}
      <div className="relative group">
        {icon && (
          <span
            className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors"
            style={{
              fontVariationSettings: isFocused
                ? "'FILL' 1"
                : "'FILL' 0",
            }}
          >
            {icon}
          </span>
        )}
        <input
          className="w-full pl-[48px] pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  )
}

export default FormInput

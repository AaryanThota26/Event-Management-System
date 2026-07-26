const SocialButton = ({ icon, label }) => {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-sm py-sm px-md border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors active:scale-95 duration-200"
    >
      <img className="w-5 h-5" src={icon} alt={`${label} icon`} />
      <span>{label}</span>
    </button>
  )
}

export default SocialButton

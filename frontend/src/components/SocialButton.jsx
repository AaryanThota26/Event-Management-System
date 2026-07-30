const SocialButton = ({ icon, label }) => {
  return (
    <button
      type="button"
      aria-label={`Sign in with ${label}`}
      className="flex-1 flex items-center justify-center gap-sm py-sm px-md border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container hover:border-primary/30 transition-all active:scale-95 duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
    >
      <img className="w-5 h-5 shrink-0" src={icon} alt="" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

export default SocialButton

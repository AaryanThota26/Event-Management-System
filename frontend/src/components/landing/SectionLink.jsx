import { Link, useLocation } from 'react-router-dom'
import { scrollToId } from './scroll'

const SectionLink = ({ id, label, className, onClick }) => {
  const { pathname } = useLocation()

  if (pathname === '/') {
    return (
      <a
        href={`#${id}`}
        className={className}
        onClick={(e) => {
          e.preventDefault()
          scrollToId(id)
          onClick?.()
        }}
      >
        {label}
      </a>
    )
  }

  return (
    <Link to={`/#${id}`} className={className} onClick={onClick}>
      {label}
    </Link>
  )
}

export default SectionLink

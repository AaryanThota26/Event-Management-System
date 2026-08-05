import { API_BASE_URL } from '../../utils/apiConfig'

export const NAV_LINKS = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Tech Stack', id: 'tech-stack' },
]

export const AUTH_ROUTES = {
  login: '/login',
  signup: '/signup',
}

export const APP_ROUTES = {
  privacy: '/privacy',
  terms: '/terms',
  help: '/help',
}

export const EXTERNAL_LINKS = {
  github: 'https://github.com/AaryanThota26/Event-Management-System',
  issues: 'https://github.com/AaryanThota26/Event-Management-System/issues',
  apiDocs: `${API_BASE_URL}/docs`,
}

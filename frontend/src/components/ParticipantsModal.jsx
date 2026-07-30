import { useState, useEffect } from 'react'
import api from '../services/api'

const ParticipantsModal = ({ eventId, eventTitle, onClose }) => {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/api/events/${eventId}/participants`)
        setParticipants(data.participants || [])
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load participants.')
      } finally {
        setLoading(false)
      }
    }
    fetchParticipants()
  }, [eventId])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-xl pt-xl pb-md border-b border-outline-variant shrink-0">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Participants
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-xs">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            close
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-xl py-lg">
          {loading && (
            <div className="flex flex-col items-center justify-center py-3xl">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-md">sync</span>
              <p className="text-body-md text-on-surface-variant">Loading participants...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-3xl">
              <span className="material-symbols-outlined text-4xl text-error mb-md">error</span>
              <p className="text-body-md text-error">{error}</p>
            </div>
          )}

          {!loading && !error && participants.length === 0 && (
            <div className="flex flex-col items-center justify-center py-3xl">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-md">person_off</span>
              <p className="text-headline-sm text-on-surface mb-xs">No participants yet</p>
              <p className="text-body-sm text-on-surface-variant">
                No one has registered for this event yet.
              </p>
            </div>
          )}

          {!loading && !error && participants.length > 0 && (
            <>
              <div className="mb-md">
                <p className="text-body-sm text-on-surface-variant">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="space-y-sm">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-md p-md rounded-xl bg-surface-container-lowest border border-outline-variant"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-sm">
                        {p.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-label-md text-on-surface truncate">{p.full_name}</p>
                      <p className="text-body-sm text-on-surface-variant truncate">{p.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-xl py-md border-t border-outline-variant shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-xl py-sm border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParticipantsModal

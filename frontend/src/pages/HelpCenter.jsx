import { Link } from 'react-router-dom'
import DocPageLayout, {
  DocPageHeader,
} from '../components/landing/DocPageLayout'
import Reveal from '../components/landing/Reveal'
import { AUTH_ROUTES, EXTERNAL_LINKS } from '../components/landing/links'

const FAQS = [
  {
    question: 'How do I create an account?',
    answer: (
      <p>
        Head to the{' '}
        <Link to={AUTH_ROUTES.signup} className="text-primary font-label-md hover:underline">
          Sign Up
        </Link>{' '}
        page, enter your full name, email, and a password of at least 6
        characters, then choose the role you want to join as. Your account is
        created instantly and you can sign in right away.
      </p>
    ),
  },
  {
    question: 'How do I become an organizer?',
    answer: (
      <p>
        During sign up, select <strong>Organizer</strong> in the &ldquo;I want
        to join as&rdquo; dropdown. Organizers can create, edit, and delete
        events and view participant lists. Accounts can&rsquo;t change roles
        after creation, so choose the role that fits how you plan to use
        EventPro.
      </p>
    ),
  },
  {
    question: 'How do I register for an event?',
    answer: (
      <p>
        Sign in as a User, open the{' '}
        <Link to="/events" className="text-primary font-label-md hover:underline">
          Events
        </Link>{' '}
        page, find an approved event, and click register. Your registration is
        saved to{' '}
        <Link to="/user/registrations" className="text-primary font-label-md hover:underline">
          My Registrations
        </Link>
        , and you can review or cancel it there.
      </p>
    ),
  },
  {
    question: 'Why is my event pending?',
    answer: (
      <p>
        Every event an organizer creates goes into the admin review queue
        before going live. A <strong>Pending</strong> status means an admin
        hasn&rsquo;t reviewed it yet. Once approved, your event appears in the
        public feed; if it&rsquo;s rejected, you can edit it and it will be
        re-submitted for review.
      </p>
    ),
  },
  {
    question: 'How do I reset my password?',
    answer: (
      <p>
        Visit the{' '}
        <Link to="/forgot-password" className="text-primary font-label-md hover:underline">
          Forgot password
        </Link>{' '}
        page and enter the email on your account. If an account exists, a reset
        link is emailed to you. Follow the link to choose a new password. For
        privacy, EventPro shows the same message whether or not the email exists.
      </p>
    ),
  },
  {
    question: 'How do I view who is registered for my event?',
    answer: (
      <p>
        As an organizer, open your event in the dashboard and click the{' '}
        <strong>Participants</strong> button. A list of registered users is
        shown so you can plan capacity and attendance.
      </p>
    ),
  },
  {
    question: 'How do I edit or delete an event?',
    answer: (
      <p>
        From the organizer dashboard, use the <strong>Edit</strong> button to
        update an event (edits are re-submitted for approval) or the{' '}
        <strong>Delete</strong> button to remove it. Deletion is confirmed
        before it happens and cannot be undone.
      </p>
    ),
  },
  {
    question: 'How do I contact support?',
    answer: (
      <p>
        Open an issue on the{' '}
        <a
          href={EXTERNAL_LINKS.issues}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-label-md hover:underline"
        >
          EventPro GitHub repository
        </a>{' '}
        and the maintainer will respond. Include the page you were on and what
        you expected to happen for the fastest help.
      </p>
    ),
  },
]

const HelpCenter = () => {
  return (
    <DocPageLayout>
      <DocPageHeader
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Quick answers to the most common questions about EventPro."
        updated="August 5, 2026"
      />

      <Reveal>
        <div className="space-y-md">
          {FAQS.map((faq, i) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden"
              open={i === 0}
            >
              <summary className="flex items-center justify-between gap-md cursor-pointer list-none px-lg py-md font-label-md text-label-md font-semibold text-on-surface hover:bg-surface-container transition-colors">
                {faq.question}
                <span
                  className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180 shrink-0"
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </summary>
              <div className="px-lg pb-lg pt-xs font-body-md text-body-md text-on-surface-variant">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-12 rounded-2xl border border-outline-variant bg-surface-container-lowest p-xl text-center">
          <p className="font-headline-sm text-headline-sm text-on-surface mb-sm">
            Still need help?
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">
            Open an issue on the repository and we&apos;ll get back to you.
          </p>
          <a
            href={EXTERNAL_LINKS.issues}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-xs px-xl py-md rounded-lg bg-primary text-on-primary font-label-md shadow-md hover:bg-primary-container transition-colors"
          >
            Open an issue
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">open_in_new</span>
          </a>
        </div>
      </Reveal>
    </DocPageLayout>
  )
}

export default HelpCenter

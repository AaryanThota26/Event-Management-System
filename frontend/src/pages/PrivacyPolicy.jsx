import DocPageLayout, {
  DocPageHeader,
  DocSection,
} from '../components/landing/DocPageLayout'
import { EXTERNAL_LINKS } from '../components/landing/links'

const PrivacyPolicy = () => {
  return (
    <DocPageLayout>
      <DocPageHeader
        eyebrow="Privacy Policy"
        title="Privacy Policy"
        description="How EventPro collects, stores, and protects your information."
        updated="August 5, 2026"
      />

      <DocSection title="Overview">
        <p>
          EventPro is a role-based event management platform. This policy
          explains what information we store, why we store it, and how we keep
          it safe. By creating an account or using the platform, you agree to
          the practices described here.
        </p>
      </DocSection>

      <DocSection title="Information we store">
        <p>
          When you create an account, we store the information you provide at
          signup:
        </p>
        <ul className="list-disc pl-lg space-y-xs">
          <li>Your full name</li>
          <li>Your email address</li>
          <li>Your account role (User, Organizer, or Admin)</li>
          <li>A hashed version of your password (see Password security below)</li>
        </ul>
        <p>
          We also store the content you create or interact with: events you
          publish (title, date, time, location, capacity, description) and the
          registrations you make on events.
        </p>
      </DocSection>

      <DocSection title="JWT authentication">
        <p>
          When you sign in, EventPro issues a short-lived, signed JSON Web Token
          (JWT). This token is stored in your browser and sent with each request
          to prove your identity and your role. Tokens are not readable by
          anyone without the server signing key, and they expire automatically.
        </p>
      </DocSection>

      <DocSection title="Password security">
        <p>
          We never store passwords in plain text. Passwords are hashed using
          bcrypt with a per-password salt, so the stored value cannot be
          reversed or reused across services. Your raw password is never logged,
          shared, or sent to any third party.
        </p>
      </DocSection>

      <DocSection title="Event and registration data">
        <p>
          Event data you publish is visible to admins (for review) and to other
          users once approved. Registration data links your account to the
          events you sign up for and is only shown to the organizing team of
          that event and to system admins.
        </p>
      </DocSection>

      <DocSection title="No payment processing">
        <p>
          EventPro does not process payments. We do not collect credit card
          numbers, billing addresses, or any other financial data. No payment
          information is ever requested, stored, or transmitted through the
          platform.
        </p>
      </DocSection>

      <DocSection title="Data security">
        <p>
          Access to your data is controlled by role-based permissions enforced
          server-side. Communication with the platform runs over HTTPS, and the
          API uses signed tokens to authenticate every request. If you ever
          suspect a security issue, please report it through the repository.
        </p>
      </DocSection>

      <DocSection title="Contact">
        <p>
          If you have questions about this policy or your data, open an issue
          on the{' '}
          <a
            href={EXTERNAL_LINKS.issues}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-label-md hover:underline"
          >
            EventPro GitHub repository
          </a>
          .
        </p>
      </DocSection>
    </DocPageLayout>
  )
}

export default PrivacyPolicy

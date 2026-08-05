import DocPageLayout, {
  DocPageHeader,
  DocSection,
} from '../components/landing/DocPageLayout'
import { EXTERNAL_LINKS } from '../components/landing/links'

const TermsOfService = () => {
  return (
    <DocPageLayout>
      <DocPageHeader
        eyebrow="Terms of Service"
        title="Terms of Service"
        description="The rules that keep EventPro fair, safe, and useful for everyone."
        updated="August 5, 2026"
      />

      <DocSection title="Acceptance of terms">
        <p>
          By accessing or using EventPro, you agree to these Terms of Service.
          If you do not agree, please do not use the platform. These terms may
          be updated from time to time; continued use after changes means you
          accept the revised terms.
        </p>
      </DocSection>

      <DocSection title="Responsible use">
        <p>
          You agree to use EventPro lawfully and respectfully. You may not use
          the platform to post misleading, harmful, or illegal content, attempt
          to access accounts or data that do not belong to you, disrupt the
          service, or circumvent access controls.
        </p>
      </DocSection>

      <DocSection title="Organizer responsibilities">
        <p>
          Organizers are responsible for the accuracy of the events they
          publish, including dates, times, locations, and capacity. Events must
          be truthful and lawful, and organizers should keep event details
          up to date. Events that violate these terms may be rejected or
          removed.
        </p>
      </DocSection>

      <DocSection title="Admin moderation">
        <p>
          Submitted events enter a review queue. Admins review each event and
          may approve, reject, or remove it at their discretion to keep the
          platform safe and useful. Approval decisions are final and do not
          imply endorsement.
        </p>
      </DocSection>

      <DocSection title="User accounts">
        <p>
          Each account is for a single person. You are responsible for keeping
          your credentials confidential and for all activity on your account.
          Do not share accounts, and let us know if you believe your account
          has been compromised.
        </p>
      </DocSection>

      <DocSection title="Event ownership">
        <p>
          You retain ownership of the content you submit to EventPro. By
          publishing an event, you grant the platform a limited license to store
          and display that content in order to provide the service. Admins may
          moderate or remove content in line with these terms.
        </p>
      </DocSection>

      <DocSection title="Limitation of liability">
        <p>
          EventPro is provided as a portfolio project "as is", without warranty
          of any kind. To the fullest extent permitted by law, the project and
          its contributors are not liable for damages arising from use of the
          service, including missed events, scheduling changes, or loss of data.
          Always confirm event details directly with organizers when it matters.
        </p>
      </DocSection>

      <DocSection title="Contact">
        <p>
          Questions about these terms? Open an issue on the{' '}
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

export default TermsOfService

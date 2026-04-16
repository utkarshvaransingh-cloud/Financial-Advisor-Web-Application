export function TermsOfServicePage() {
  return (
    <div className="page page--readable support-page">
      <header className="page__header">
        <h1 className="page__title">Terms of Service</h1>
        <p className="page__subtitle">
          Rules for using the Financial Advisor application.
        </p>
      </header>

      <article className="prose card">
        <h2>Use of the app</h2>
        <p>
          Financial Advisor is designed for personal budgeting, expense
          tracking, educational ITR guidance, and general financial awareness.
        </p>

        <h2>No professional advice</h2>
        <p>
          The app does not replace a certified financial advisor, chartered
          accountant, or legal professional. Verify tax and investment decisions
          with a qualified expert.
        </p>

        <h2>User responsibility</h2>
        <p>
          You are responsible for entering accurate information and protecting
          your login credentials.
        </p>

        <h2>Availability</h2>
        <p>
          We aim to keep the service reliable, but availability can be affected
          by hosting, database, network, or maintenance events.
        </p>
      </article>
    </div>
  )
}

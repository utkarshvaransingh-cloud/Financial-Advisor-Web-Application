export function PrivacyPolicyPage() {
  return (
    <div className="page page--readable support-page">
      <header className="page__header">
        <h1 className="page__title">Privacy Policy</h1>
        <p className="page__subtitle">
          How Financial Advisor protects and uses your information.
        </p>
      </header>

      <article className="prose card">
        <h2>Information we collect</h2>
        <p>
          We collect account details, income entries, expense records, budgets,
          and messages you submit through the support form so the app can
          provide useful financial summaries and assistance.
        </p>

        <h2>How we use data</h2>
        <p>
          Your data is used to power dashboard totals, reports, budget alerts,
          chatbot context, and account access. We do not sell personal data.
        </p>

        <h2>Security</h2>
        <p>
          Authentication uses secure password hashing and token-based sessions.
          Database access should be protected through environment variables and
          your Neon account controls.
        </p>

        <h2>Your choices</h2>
        <p>
          You can stop using the service at any time. For production use, add
          account deletion and export workflows before collecting real user data.
        </p>
      </article>
    </div>
  )
}

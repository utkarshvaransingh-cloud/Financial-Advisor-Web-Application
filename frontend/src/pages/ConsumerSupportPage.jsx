export function ConsumerSupportPage() {
  return (
    <div className="page page--readable support-page">
      <header className="page__header">
        <h1 className="page__title">Consumer Support</h1>
        <p className="page__subtitle">
          Help for common account, budgeting, and ITR guidance questions.
        </p>
      </header>

      <article className="prose card">
        <h2>Support hours</h2>
        <p>Monday to Friday, 9:00 AM to 6:00 PM IST.</p>

        <h2>Common issues</h2>
        <ul>
          <li>Unable to register or sign in.</li>
          <li>Income, expense, or budget data not appearing correctly.</li>
          <li>Questions about monthly reports or budget alerts.</li>
          <li>General ITR form and deduction guidance.</li>
        </ul>

        <h2>Before contacting support</h2>
        <p>
          Please include the page you were using, what you expected to happen,
          and any visible error message. This helps us resolve issues faster.
        </p>
      </article>
    </div>
  )
}

export function ContactUsPage() {
  return (
    <div className="page page--readable support-page">
      <header className="page__header">
        <h1 className="page__title">Contact Us</h1>
        <p className="page__subtitle">
          Reach the Financial Advisor team for help or feedback.
        </p>
      </header>

      <article className="prose card">
        <h2>Email</h2>
        <p>support@financialadvisor.gla</p>

        <h2>Phone</h2>
        <p>+91 8299523024</p>

        <h2>Office</h2>
        <p>Mathura, U.P., India.</p>

        <h2>Send a message</h2>
        <p>
          You can also use the footer form on any page. Submitted messages are
          saved locally in this demo and can later be connected to an email or
          database-backed support system.
        </p>
      </article>
    </div>
  )
}

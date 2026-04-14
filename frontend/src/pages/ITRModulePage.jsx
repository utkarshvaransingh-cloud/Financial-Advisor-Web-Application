export function ITRModulePage() {
  return (
    <div className="page page--readable">
      <header className="page__header">
        <h1 className="page__title">ITR basics (India)</h1>
        <p className="page__subtitle">
          Educational overview — verify with a CA or official guidance for your
          case.
        </p>
      </header>

      <article className="prose card">
        <h2>Who files?</h2>
        <p>
          Residents with income above the basic exemption limit, or those who
          meet other conditions (foreign assets, high deposits, etc.), generally
          need to file an Income Tax Return (ITR).
        </p>

        <h2>Common ITR forms</h2>
        <ul>
          <li>
            <strong>ITR-1 (Sahaj):</strong> Salary, one house property, other
            sources — for many salaried individuals.
          </li>
          <li>
            <strong>ITR-2:</strong> Capital gains, multiple properties, foreign
            income, etc.
          </li>
          <li>
            <strong>ITR-3 / ITR-4:</strong> Business/profession or presumptive
            schemes — pick based on income sources.
          </li>
        </ul>

        <h2>Deductions (examples)</h2>
        <ul>
          <li>
            <strong>Section 80C:</strong> EPF, ELSS, life insurance premium,
            tuition fees — subject to an overall cap (check current limits).
          </li>
          <li>
            <strong>80D:</strong> Health insurance premiums for self/family.
          </li>
          <li>
            <strong>80TTA/80TTB:</strong> Interest on savings (limits differ for
            senior citizens).
          </li>
        </ul>

        <h2>Tips</h2>
        <ol>
          <li>Collect Form 16, bank statements, and investment proofs.</li>
          <li>Reconcile TDS with Form 26AS on the e-filing portal.</li>
          <li>File before the due date to avoid late fees and interest.</li>
        </ol>
      </article>
    </div>
  )
}

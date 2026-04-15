import React, { useState } from 'react';

export function ITRModulePage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="page page--readable">
      {/* 1. Hero Section */}
      <header className="page__header hero-gradient">
        <h1 className="page__title">File your ITR easily</h1>
        <p className="page__subtitle">
          Complete guide for individuals to declare income, claim refunds, and stay compliant.
        </p>
        <div className="hero-cta">
          <button className="btn btn--primary">Start Filing Now</button>
        </div>
      </header>

      <article className="prose card">
        {/* Intro */}
        <section>
          <h2>What is an Income Tax Return (ITR)?</h2>
          <p>
            An ITR is an official document filed with the Income Tax Department of India to declare total income, 
            claim deductions, and report taxes paid during a financial year. It serves as legal proof of income 
            and a record for future financial needs.
          </p>
        </section>

        {/* 2. Cards Section: Benefits & Types */}
        <section className="grid-container">
          <div className="feature-card">
            <h3>🎯 Why File ITR?</h3>
            <ul>
              <li><strong>Financial:</strong> Easy loan approvals & faster visa processing.</li>
              <li><strong>Legal:</strong> Avoid penalties and maintain clean tax records.</li>
              <li><strong>Wealth:</strong> Carry forward capital losses & plan investments.</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3>📊 Common ITR Forms</h3>
            <ul>
              <li><strong>ITR-1 (Sahaj):</strong> Salary, 1 house, up to ₹50 Lakh.</li>
              <li><strong>ITR-2:</strong> Capital gains, foreign income, multiple houses.</li>
              <li><strong>ITR-3:</strong> Business owners & professionals (CAs, Doctors).</li>
              <li><strong>ITR-4 (Sugam):</strong> Presumptive income for small businesses.</li>
            </ul>
          </div>
        </section>

        <hr />

        {/* 3. Stepper: Filing Process */}
        <section className="stepper-section">
          <h2>🧮 Step-by-Step Filing Process</h2>
          <div className="stepper">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Login:</strong> Access the Income Tax portal using PAN & password.
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Income Details:</strong> Fill in Salary, Interest, Rental, and Capital Gains.
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Claim Deductions:</strong> Apply 80C (Investments), 80D (Health), and 80E.
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <strong>Verify:</strong> Authenticate via Aadhaar OTP or Net Banking (Crucial!).
              </div>
            </div>
          </div>
        </section>

        <hr />

        {/* 4. FAQ Accordion */}
        <section className="faq-section">
          <h2>❓ Frequently Asked Questions</h2>
          <div className="accordion">
            {[
              { q: "Can I file ITR without Form 16?", a: "Yes, you can use your monthly salary slips and bank statements to calculate income." },
              { q: "Is it mandatory for students to file?", a: "Not mandatory if income is below the limit, but useful for building a financial history." },
              { q: "How long should I keep records?", a: "It is recommended to keep your tax records for at least 6 years." }
            ].map((item, index) => (
              <div key={index} className="accordion-item" onClick={() => toggleFaq(index)}>
                <div className="accordion-header">
                  <strong>{item.q}</strong>
                  <span>{activeFaq === index ? "−" : "+"}</span>
                </div>
                {activeFaq === index && <div className="accordion-body">{item.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* 5. Chatbot Widget */}
      <div className="chatbot-trigger">
        <div className="chatbot-bubble">
          <p><strong>Ask AI Financial Advisor</strong></p>
          <p>Suggests forms, analyzes income, & gives tips!</p>
        </div>
        <button className="btn-chat">💬 Ask tax questions</button>
      </div>

      <style jsx>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 3rem 1.5rem;
          border-radius: 0 0 1rem 1rem;
          margin-bottom: 2rem;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .feature-card {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }
        .stepper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .step {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .step-number {
          background: #3b82f6;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: bold;
        }
        .accordion-item {
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 0;
          cursor: pointer;
        }
        .accordion-header {
          display: flex;
          justify-content: space-between;
        }
        .accordion-body {
          padding-top: 0.5rem;
          color: #64748b;
        }
        .chatbot-trigger {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .chatbot-bubble {
          background: white;
          padding: 1rem;
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          border: 1px solid #e2e8f0;
          max-width: 200px;
        }
        .btn-chat {
          background: #1e293b;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          border: none;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .btn--primary {
          background: white;
          color: #1e40af;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
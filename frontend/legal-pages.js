/* global initializeGlobalFooter */
/**
 * Page Generator for Legal & Support Pages
 * Usage: Call renderLegalPage('privacy') etc.
 */

const pageContent = {
    privacy: {
        title: "Privacy Policy",
        content: `
            <p>Your privacy is important to us. This policy explains how we handle your data when you use our ITR filing services.</p>
            <h3>1. Data Collection</h3>
            <p>We collect information such as PAN, Aadhaar details, and financial records solely for the purpose of tax return preparation.</p>
            <h3>2. Data Security</h3>
            <p>All data is encrypted using industry-standard protocols before being transmitted to the Income Tax Department.</p>
            <h3>3. Third-Party Sharing</h3>
            <p>We do not sell your personal data. Information is only shared with government authorities as required by law.</p>
        `
    },
    terms: {
        title: "Terms of Service",
        content: `
            <p>By using this platform, you agree to the following terms and conditions.</p>
            <h3>1. Accuracy of Information</h3>
            <p>The user is responsible for the accuracy of all financial data provided for ITR filing.</p>
            <h3>2. Limitation of Liability</h3>
            <p>While we provide educational tools and filing assistance, final verification should be done by a qualified professional.</p>
            <h3>3. Service Availability</h3>
            <p>We strive for 99% uptime, but are not liable for delays caused by government portal maintenance.</p>
        `
    },
    support: {
        title: "Consumer Support",
        content: `
            <p>Need help with your filing? Our support team is available to assist you.</p>
            <h3>Hours of Operation</h3>
            <p>Monday - Friday: 9:00 AM to 6:00 PM (IST)</p>
            <h3>Common Issues</h3>
            <ul>
                <li>Payment failure during filing</li>
                <li>Mismatch in Form 26AS</li>
                <li>E-verification errors</li>
            </ul>
        `
    },
    contact: {
        title: "Contact Us",
        content: `
            <p>Get in touch with our team for business inquiries or technical help.</p>
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>📧 Email:</strong> support@itrapp.in</p>
                <p><strong>📞 Phone:</strong> +91 1800-XXX-XXXX</p>
                <p><strong>📍 Office:</strong> Financial District, Hyderabad, India</p>
            </div>
        `
    }
};

function renderLegalPage(type) {
    const data = pageContent[type];
    if (!data) return;

    // Clear existing body or container
    document.body.innerHTML = "";

    // Apply Page Styles
    document.body.style.backgroundColor = "#0f172a"; // Match your deep navy theme
    document.body.style.color = "#f8fafc";
    document.body.style.fontFamily = "sans-serif";
    document.body.style.margin = "0";

    // Create Main Container
    const container = document.createElement('div');
    container.style.maxWidth = "800px";
    container.style.margin = "60px auto";
    container.style.padding = "40px";
    container.style.background = "#1e293b"; // Slightly lighter slate
    container.style.borderRadius = "12px";
    container.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";

    // Header
    const h1 = document.createElement('h1');
    h1.textContent = data.title;
    h1.style.borderBottom = "2px solid #3b82f6";
    h1.style.paddingBottom = "15px";
    h1.style.marginBottom = "30px";

    // Content Body
    const bodyText = document.createElement('div');
    bodyText.innerHTML = data.content;
    bodyText.style.lineHeight = "1.8";
    bodyText.style.fontSize = "1.1rem";

    // Back Button
    const btn = document.createElement('button');
    btn.textContent = "← Back to Home";
    btn.style.marginTop = "40px";
    btn.style.padding = "10px 20px";
    btn.style.background = "transparent";
    btn.style.border = "1px solid #3b82f6";
    btn.style.color = "#3b82f6";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.onclick = () => window.history.back();

    container.appendChild(h1);
    container.appendChild(bodyText);
    container.appendChild(btn);
    document.body.appendChild(container);

    // Reinject the footer so it appears on these pages too
    if (typeof initializeGlobalFooter === "function") {
        initializeGlobalFooter();
    }
}

// Logic to detect which page to show based on URL parameters
// Example: privacy.html?page=privacy
const urlParams = new URLSearchParams(window.location.search);
const pageToLoad = urlParams.get('page');
if (pageToLoad) {
    renderLegalPage(pageToLoad);
}

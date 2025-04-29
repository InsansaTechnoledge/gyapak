// src/FAQ/data/faqData.js

export const defaultFAQs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions sent to your email.",
      categories: ["Account", "Security"],
      state: "published",
      seoTags: ["password-reset", "login-help", "account-recovery"]
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. For enterprise customers, we also offer invoicing options.",
      categories: ["Billing", "Payment"],
      state: "published",
      seoTags: ["payment-methods", "credit-card", "paypal"]
    },
    {
      question: "How can I contact customer support?",
      answer: "Our support team is available 24/7 via email at support@example.com or through the chat option in your account dashboard.",
      categories: ["Support", "Contact"],
      state: "published",
      seoTags: ["customer-support", "contact-us", "help"]
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
      categories: ["Billing", "Subscription"],
      state: "published",
      seoTags: ["cancel-subscription", "billing", "account-management"]
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all our subscription plans. If you're not satisfied, please contact our support team within this period to process your refund.",
      categories: ["Billing", "Refunds"],
      state: "published",
      seoTags: ["refund-policy", "money-back", "customer-satisfaction"]
    },
    {
      question: "How do I update my billing information?",
      answer: "You can update your billing information from your account settings under the 'Billing' tab. There you can change your payment method, address, and other details.",
      categories: ["Billing", "Account"],
      state: "published",
      seoTags: ["update-billing", "payment-info", "account-settings"]
    },
    {
      question: "What is your data privacy policy?",
      answer: "We take data privacy seriously. We never sell your data to third parties and use industry-standard encryption. For more details, please see our full Privacy Policy document.",
      categories: ["Privacy", "Security"],
      state: "published",
      seoTags: ["privacy-policy", "data-protection", "gdpr"]
    },
    {
      question: "How secure is my data?",
      answer: "Your data is encrypted both in transit and at rest. We use bank-level security measures and regular security audits to ensure your information remains safe.",
      categories: ["Security", "Privacy"],
      state: "published",
      seoTags: ["data-security", "encryption", "safe-storage"]
    },
    {
      question: "Do you have an API?",
      answer: "Yes, we offer a comprehensive API for developers. You can find the documentation and keys in your account dashboard under the 'Developer' section.",
      categories: ["Developers", "API"],
      state: "published",
      seoTags: ["api-access", "developer-tools", "integration"]
    },
    {
      question: "What are the system requirements?",
      answer: "Our platform works on all modern browsers (Chrome, Firefox, Safari, Edge) updated within the last two years. Mobile apps are available for iOS 13+ and Android 8+.",
      categories: ["Technical", "Requirements"],
      state: "published",
      seoTags: ["system-requirements", "browser-compatibility", "mobile-support"]
    },
    {
      question: "Can I access my account from multiple devices?",
      answer: "Yes, you can access your account from any device with an internet connection. Your data will automatically sync across all your devices.",
      categories: ["Account", "Technical"],
      state: "published",
      seoTags: ["multi-device", "sync", "mobile-access"]
    },
    {
      question: "How does the free trial work?",
      answer: "Our free trial gives you 14 days of access to all premium features with no credit card required. At the end of the trial, you can choose a subscription plan to continue.",
      categories: ["Billing", "Trial"],
      state: "published",
      seoTags: ["free-trial", "premium-features", "no-credit-card"]
    },
    {
      question: "What is our new enterprise solution?",
      answer: "Our enterprise solution offers dedicated support, custom integrations, and advanced security features for large organizations. Contact our sales team for a demo.",
      categories: ["Enterprise", "Solutions"],
      state: "draft",
      seoTags: ["enterprise", "business-solution", "custom-integration"]
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes, we offer special pricing for verified non-profit organizations. Please contact our sales team with your non-profit documentation to apply.",
      categories: ["Billing", "Non-Profit"],
      state: "archived",
      seoTags: ["non-profit", "discounts", "special-pricing"]
    }
  ];
  
  export default defaultFAQs;
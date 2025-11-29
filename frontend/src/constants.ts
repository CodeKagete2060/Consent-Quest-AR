// Mock data and AI prompts for Consent Quest: Safety Sentinel

export const AI_PROMPTS = {
  scamAnalysis: `Analyze this image/text for potential scams, fraud, or digital abuse patterns.
  Focus on common African contexts like MoMo reversals, romance fraud, job scams, photo leaks.
  Provide a risk level (low/medium/high), brief explanation, and safety advice.
  Keep response under 200 words.`,

  safetyTip: `Generate a personalized daily safety tip for a young African woman based on her age range and interests.
  Make it culturally relevant and actionable. Keep under 100 words.`,

  videoScenario: `Create a short video script (30-60 seconds) demonstrating a scam scenario and safe response.
  Include dialogue, actions, and educational overlay text. Focus on prevention and empowerment.`,

  threatSummary: `Summarize recent digital threats in African contexts. Include statistics, trends, and prevention tips.
  Keep under 150 words.`
};

export const MOCK_THREATS = [
  {
    id: '1',
    type: 'romance_fraud',
    title: 'Romance Scam Alert',
    description: 'New pattern: Fake profiles on dating apps promising jobs abroad.',
    risk: 'high' as const,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: 'Multiple countries',
    aiAnalysis: 'High-risk pattern matches known romance fraud tactics. Advise verifying identities through video calls.'
  },
  {
    id: '2',
    type: 'momo_reversal',
    title: 'MoMo Reversal Scam',
    description: 'Victims reporting unauthorized transactions after sharing PINs.',
    risk: 'medium' as const,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    location: 'Ghana, Nigeria',
    aiAnalysis: 'Common in mobile money apps. Always use official channels and never share PINs.'
  },
  {
    id: '3',
    type: 'job_offer',
    title: 'Fake Job Offers',
    description: 'Scammers posing as employers requesting upfront payments.',
    risk: 'high' as const,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    location: 'Kenya, Uganda',
    aiAnalysis: 'Red flag: Requests for payment before employment. Legitimate jobs don\'t charge fees.'
  }
];

export const SAFETY_RULES = [
  "Never share personal photos with strangers online",
  "Verify identities through multiple channels before trusting",
  "Don't send money to people you haven't met in person",
  "Report suspicious accounts immediately",
  "Use strong, unique passwords for each account",
  "Enable two-factor authentication everywhere possible",
  "Be cautious with QR codes and links from unknown sources",
  "Trust your instincts - if something feels wrong, it probably is"
];

export const DAILY_TIPS = [
  "Check your privacy settings on social media weekly",
  "Don't accept friend requests from people you don't know",
  "Use official apps for mobile money transactions",
  "Save important conversations as screenshots before deleting",
  "Tell a trusted friend or family member about online interactions",
  "Research companies before applying for jobs online",
  "Avoid clicking links in unsolicited messages",
  "Regularly review and revoke app permissions"
];

export const REPORT_CATEGORIES = [
  'Harassment',
  'Scam/Fraud',
  'Photo Leak',
  'Threats',
  'Impersonation',
  'Spam',
  'Other'
];

export const COUNTRIES = [
  'Kenya',
  'Nigeria',
  'South Africa',
  'Ghana',
  'Uganda',
  'Tanzania',
  'Zimbabwe',
  'Botswana'
];

export const AGE_RANGES = [
  '13-17',
  '18-24',
  '25-34',
  '35+'
];

export const INTERESTS = [
  'WhatsApp',
  'Instagram',
  'Facebook',
  'TikTok',
  'Mobile Money',
  'Online Dating',
  'Job Search',
  'Social Media'
];
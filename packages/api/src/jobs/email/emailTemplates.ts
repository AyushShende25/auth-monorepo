export const getVerificationTemplate = (firstname: string, code: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
    <h2 style="color: #333333; text-align: center;">Welcome to Organization-Name, ${firstname}!</h2>
    <p style="text-align: center;">Use this code to verify your account:</p>
    <div style="text-align: center; font-size: 24px; font-weight: bold;">${code}</div>
    <p style="text-align: center;">This code expires in 10 minutes.</p>
  </div>
`;

export const getWelcomeTemplate = (firstname: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
    <h2 style="color: #333333; text-align: center;">Welcome to Organization-Name, ${firstname}!</h2>
    <p style="text-align: center;">We're thrilled to have you on board.</p>
  </div>
`;

export const getResetTemplate = (resetLink: string) =>
  `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 10 minutes.</p>`;

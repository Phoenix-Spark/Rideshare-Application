export type EmailTemplateType = 'verification' | 'welcome' | 'passwordReset' | 'invitation';

interface VerificationData {
  code: string;
}

interface WelcomeData {
  username: string;
}

interface PasswordResetData {
  resetLink: string;
}

interface InvitationData {
  inviterName: string;
  inviteLink: string;
}

export type EmailTemplateData = 
  | { type: 'verification'; data: VerificationData }
  | { type: 'welcome'; data: WelcomeData }
  | { type: 'passwordReset'; data: PasswordResetData }
  | { type: 'invitation'; data: InvitationData };

interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

export function getEmailTemplate(template: EmailTemplateData): EmailContent {
  switch (template.type) {
    case 'verification':
      return getVerificationTemplate(template.data);
    case 'welcome':
      return getWelcomeTemplate(template.data);
    case 'passwordReset':
      return getPasswordResetTemplate(template.data);
    case 'invitation':
      return getInvitationTemplate(template.data);
  }
}

function getVerificationTemplate({ code }: VerificationData): EmailContent {
  return {
    subject: "Verify Your Email Address",
    text: `Your Base Bound verification code is: ${code}\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f7;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Base Bound</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                    <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 24px;">
                      Thank you for signing up! Please use the verification code below to complete your registration:
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                      <tr>
                        <td style="background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 24px; text-align: center;">
                          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                            ${code}
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 24px 0 0; color: #718096; font-size: 14px; line-height: 20px;">
                      This code will expire in <strong>5 minutes</strong>. If you didn't request this code, please ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="margin: 8px 0 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      © ${new Date().getFullYear()} Base Bound. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}

function getWelcomeTemplate({ username }: WelcomeData): EmailContent {
  return {
    subject: "Welcome to Base Bound!",
    text: `Welcome to Base Bound, ${username}!\n\nWe're excited to have you on board.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Base Bound</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f7;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Base Bound</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Welcome, ${username}! 🎉</h2>
                    <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 24px;">
                      We're excited to have you on board. Your account has been successfully created.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="margin: 8px 0 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      © ${new Date().getFullYear()} Base Bound. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}

function getPasswordResetTemplate({ resetLink }: PasswordResetData): EmailContent {
  return {
    subject: "Reset Your Password",
    text: `Click the link to reset your password: ${resetLink}\n\nThis link will expire in 1 hour.`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f7;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Base Bound</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                    <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 24px;">
                      Click the button below to reset your password:
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="margin: 8px 0 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      © ${new Date().getFullYear()} Base Bound. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}

function getInvitationTemplate({ inviterName, inviteLink }: InvitationData): EmailContent {
  return {
    subject: `${inviterName} invited you to join Base Bound`,
    text: `${inviterName} has invited you to join their team on Base Bound!\n\nClick the link: ${inviteLink}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've Been Invited</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f7;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Base Bound</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 24px; font-weight: 600;">You've Been Invited!</h2>
                    <p style="margin: 0 0 24px; color: #4a5568; font-size: 16px; line-height: 24px;">
                      <strong>${inviterName}</strong> has invited you to join their team on Base Bound.
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${inviteLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                            Accept Invitation
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="margin: 8px 0 0; color: #a0aec0; font-size: 12px; line-height: 18px; text-align: center;">
                      © ${new Date().getFullYear()} Base Bound. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };
}
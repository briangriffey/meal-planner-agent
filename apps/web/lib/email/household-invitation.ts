import { EmailConnector, EmailConnectorConfig } from '@meal-planner/core';

// Brand colors matching the meal plan email templates
const BRAND_COLORS = {
  primaryTeal: '#3F9BA6',
  primaryTealDark: '#2A6B73',
  accentTerracotta: '#A66A5D',
  accentTerracottaDark: '#8B4F44',
  backgroundGray: '#f5f5f5',
  textDark: '#1f2937',
  white: '#ffffff',
  lightGray: '#f9f9f9',
  mediumGray: '#666'
};

/**
 * Generate HTML email template for household invitation
 */
function generateInvitationEmailHTML(
  acceptUrl: string,
  householdName: string,
  inviterName: string | null
): string {
  const inviterDisplay = inviterName || 'A household member';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Household Invitation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: ${BRAND_COLORS.backgroundGray};
            color: ${BRAND_COLORS.textDark};
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: ${BRAND_COLORS.white};
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, ${BRAND_COLORS.primaryTeal}, ${BRAND_COLORS.primaryTealDark});
            color: ${BRAND_COLORS.white};
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: ${BRAND_COLORS.textDark};
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: ${BRAND_COLORS.mediumGray};
            line-height: 1.8;
        }
        .household-name {
            background: ${BRAND_COLORS.lightGray};
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
            border-left: 4px solid ${BRAND_COLORS.primaryTeal};
        }
        .household-name strong {
            font-size: 20px;
            color: ${BRAND_COLORS.primaryTealDark};
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .accept-button {
            display: inline-block;
            background: linear-gradient(135deg, ${BRAND_COLORS.accentTerracotta}, ${BRAND_COLORS.accentTerracottaDark});
            color: ${BRAND_COLORS.white};
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(166, 106, 93, 0.3);
        }
        .accept-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(166, 106, 93, 0.4);
        }
        .expiry-notice {
            background: ${BRAND_COLORS.lightGray};
            border-left: 4px solid ${BRAND_COLORS.accentTerracotta};
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .expiry-notice strong {
            color: ${BRAND_COLORS.accentTerracottaDark};
        }
        .fallback-link {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid ${BRAND_COLORS.backgroundGray};
            font-size: 14px;
            color: ${BRAND_COLORS.mediumGray};
        }
        .fallback-link a {
            color: ${BRAND_COLORS.primaryTeal};
            word-break: break-all;
        }
        .footer {
            background: ${BRAND_COLORS.backgroundGray};
            text-align: center;
            padding: 30px 20px;
            color: ${BRAND_COLORS.mediumGray};
            font-size: 14px;
        }
        .footer p {
            margin: 5px 0;
        }
        @media (max-width: 480px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .content {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .accept-button {
                padding: 14px 30px;
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Easy Meal Planner</h1>
            <p>You've been invited to join a household!</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello,
            </div>

            <div class="message">
                ${inviterDisplay} has invited you to join their household on Easy Meal Planner.
            </div>

            <div class="household-name">
                <strong>${householdName}</strong>
            </div>

            <div class="message">
                By joining this household, you'll be able to:
            </div>

            <div class="message">
                • Share meal plans with other household members<br>
                • Set your own dietary restrictions and preferences<br>
                • Contribute to collaborative meal planning<br>
                • View and access shared shopping lists
            </div>

            <div class="button-container">
                <a href="${acceptUrl}" class="accept-button">
                    Accept Invitation
                </a>
            </div>

            <div class="expiry-notice">
                <strong>Important:</strong> This invitation link will expire in 7 days for security reasons.
            </div>

            <div class="fallback-link">
                <strong>Button not working?</strong> Copy and paste this link into your browser:<br>
                <a href="${acceptUrl}">${acceptUrl}</a>
            </div>
        </div>

        <div class="footer">
            <p>🍽️ <strong>Easy Meal Planner</strong></p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            <p style="font-size: 12px; color: #999; margin-top: 15px;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Send household invitation email
 *
 * @param email - Recipient email address
 * @param token - Invitation token
 * @param householdName - Name of the household
 * @param inviterName - Name of the person inviting (optional)
 * @returns Promise with send result
 */
export async function sendHouseholdInvitationEmail(
  email: string,
  token: string,
  householdName: string,
  inviterName: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    // Build acceptance URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const acceptUrl = `${baseUrl}/api/households/invitations/accept?token=${token}`;

    // Configure email connector
    const config: EmailConnectorConfig = {
      user: process.env.GMAIL_USER || '',
      appPassword: process.env.GMAIL_APP_PASSWORD || '',
      recipients: [email]
    };

    // Check for missing configuration
    if (!config.user || !config.appPassword) {
      console.error('Email configuration missing: GMAIL_USER or GMAIL_APP_PASSWORD not set');
      return {
        success: false,
        error: 'Email configuration is incomplete'
      };
    }

    // Generate email HTML
    const emailHTML = generateInvitationEmailHTML(acceptUrl, householdName, inviterName);

    // Send email
    const emailConnector = new EmailConnector(config, false);
    const result = await emailConnector.execute({
      subject: `You've been invited to join ${householdName} on Meal Planner`,
      body: emailHTML
    });

    if (result.success) {
      console.log(`Household invitation email sent successfully to ${email}`);
      return { success: true };
    } else {
      console.error(`Failed to send invitation email: ${result.error}`);
      return {
        success: false,
        error: result.error || 'Failed to send email'
      };
    }
  } catch (error) {
    console.error('Error sending household invitation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

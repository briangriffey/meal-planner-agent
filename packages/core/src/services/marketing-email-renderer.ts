// Brand colors - consistent with email-template-renderer.ts
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

export interface ReleaseData {
  version: string;
  features?: string[];
  fixes?: string[];
  improvements?: string[];
  date?: string;
  rawNotes?: string;
}

export class MarketingEmailRenderer {
  /**
   * Render complete HTML email for release announcement
   */
  render(data: ReleaseData): string {
    const { version, features = [], fixes = [], improvements = [], date, rawNotes } = data;
    const releaseDate = date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Release: ${this.escapeHtml(version)}</title>
    ${this.renderStyles()}
</head>
<body>
    <div class="container">
        ${this.renderHeader(version, releaseDate)}

        <div class="content">
            ${this.renderIntro()}
            ${features.length > 0 ? this.renderSection('✨ New Features', features, 'features') : ''}
            ${improvements.length > 0 ? this.renderSection('🚀 Improvements', improvements, 'improvements') : ''}
            ${fixes.length > 0 ? this.renderSection('🐛 Bug Fixes', fixes, 'fixes') : ''}
            ${rawNotes ? this.renderRawNotes(rawNotes) : ''}
            ${this.renderCallToAction()}
        </div>

        ${this.renderFooter()}
    </div>
</body>
</html>`;
  }

  /**
   * Render CSS styles
   */
  private renderStyles(): string {
    return `<style>
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
            font-size: 32px;
            font-weight: bold;
        }
        .header .version {
            font-size: 24px;
            margin: 10px 0;
            opacity: 0.95;
        }
        .header .date {
            font-size: 14px;
            margin: 10px 0 0 0;
            opacity: 0.8;
        }
        .content {
            padding: 30px 20px;
        }
        .intro {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 30px;
            text-align: center;
            color: ${BRAND_COLORS.mediumGray};
        }
        .section {
            margin: 30px 0;
            background: ${BRAND_COLORS.lightGray};
            border-radius: 12px;
            padding: 20px;
            border-left: 4px solid ${BRAND_COLORS.primaryTeal};
        }
        .section.features {
            border-left-color: ${BRAND_COLORS.primaryTeal};
        }
        .section.improvements {
            border-left-color: ${BRAND_COLORS.accentTerracotta};
        }
        .section.fixes {
            border-left-color: ${BRAND_COLORS.mediumGray};
        }
        .section h2 {
            margin: 0 0 15px 0;
            font-size: 20px;
            color: ${BRAND_COLORS.primaryTealDark};
        }
        .section ul {
            margin: 0;
            padding-left: 20px;
        }
        .section li {
            margin: 10px 0;
            font-size: 15px;
            line-height: 1.6;
        }
        .raw-notes {
            background: ${BRAND_COLORS.lightGray};
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            font-size: 14px;
            line-height: 1.8;
            white-space: pre-wrap;
            color: ${BRAND_COLORS.textDark};
        }
        .cta {
            background: linear-gradient(135deg, ${BRAND_COLORS.accentTerracotta}, ${BRAND_COLORS.accentTerracottaDark});
            color: ${BRAND_COLORS.white};
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
        }
        .cta h3 {
            margin: 0 0 15px 0;
            font-size: 22px;
        }
        .cta p {
            margin: 0 0 20px 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .cta-button {
            display: inline-block;
            background: ${BRAND_COLORS.white};
            color: ${BRAND_COLORS.accentTerracotta};
            padding: 12px 30px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
        }
        .footer {
            background: ${BRAND_COLORS.backgroundGray};
            padding: 30px 20px;
            text-align: center;
            font-size: 14px;
            color: ${BRAND_COLORS.mediumGray};
        }
        .footer p {
            margin: 5px 0;
        }
        .footer a {
            color: ${BRAND_COLORS.primaryTeal};
            text-decoration: none;
        }
    </style>`;
  }

  /**
   * Render header with version and date
   */
  private renderHeader(version: string, date: string): string {
    return `<div class="header">
        <h1>🎉 New Release Available!</h1>
        <div class="version">${this.escapeHtml(version)}</div>
        <div class="date">${this.escapeHtml(date)}</div>
    </div>`;
  }

  /**
   * Render intro message
   */
  private renderIntro(): string {
    return `<div class="intro">
        <p>We're excited to share the latest improvements to your Meal Planner! Check out what's new below.</p>
    </div>`;
  }

  /**
   * Render a section (features, improvements, or fixes)
   */
  private renderSection(title: string, items: string[], type: 'features' | 'improvements' | 'fixes'): string {
    if (items.length === 0) return '';

    return `<div class="section ${type}">
        <h2>${title}</h2>
        <ul>
            ${items.map(item => `<li>${this.escapeHtml(item)}</li>`).join('\n            ')}
        </ul>
    </div>`;
  }

  /**
   * Render raw release notes if provided
   */
  private renderRawNotes(notes: string): string {
    return `<div class="raw-notes">
        ${this.escapeHtml(notes)}
    </div>`;
  }

  /**
   * Render call-to-action section
   */
  private renderCallToAction(): string {
    return `<div class="cta">
        <h3>Try It Now!</h3>
        <p>Log in to your account to experience the latest features and improvements.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.meal-planner.com'}" class="cta-button">Open Meal Planner</a>
    </div>`;
  }

  /**
   * Render footer
   */
  private renderFooter(): string {
    return `<div class="footer">
        <p>Thank you for using Meal Planner!</p>
        <p>Have questions or feedback? <a href="mailto:support@meal-planner.com">Contact us</a></p>
        <p style="margin-top: 20px; font-size: 12px;">
            You're receiving this email because you have an account with Meal Planner.
        </p>
    </div>`;
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

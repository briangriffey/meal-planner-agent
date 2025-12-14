import nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { BaseConnector } from './base';

export interface EmailConnectorConfig {
  user: string;
  appPassword: string;
  recipients: string[];
}

export class EmailConnector extends BaseConnector {
  name = 'send_email';
  private transporter: nodemailer.Transporter | null;
  private config: EmailConnectorConfig;
  private testMode: boolean;

  constructor(config: EmailConnectorConfig, testMode: boolean = false) {
    super();
    this.config = config;
    this.testMode = testMode;

    if (!testMode) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.appPassword
        }
      });
    } else {
      this.transporter = null;
    }
  }

  async execute(params: { subject: string; body: string }): Promise<any> {
    try {
      if (this.testMode) {
        const outputPath = path.join(process.cwd(), 'TESTEMAIL.html');

        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }

        const emailContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${params.subject}</title>
</head>
<body>
  <div style="background: #f5f5f5; padding: 20px; margin-bottom: 20px;">
    <h1 style="margin: 0;">Email Preview</h1>
    <p style="margin: 5px 0;"><strong>Subject:</strong> ${params.subject}</p>
    <p style="margin: 5px 0;"><strong>From:</strong> ${this.config.user || 'Not configured'}</p>
    <p style="margin: 5px 0;"><strong>To:</strong> ${this.config.recipients?.join(', ') || 'Not configured'}</p>
  </div>
  ${params.body}
</body>
</html>`;

        fs.writeFileSync(outputPath, emailContent, 'utf-8');

        return {
          success: true,
          testMode: true,
          filePath: outputPath,
          message: `Email content saved to ${outputPath}`
        };
      } else {
        const info = await this.transporter!.sendMail({
          from: this.config.user,
          to: this.config.recipients.join(', '),
          subject: params.subject,
          html: params.body
        });

        return {
          success: true,
          testMode: false,
          messageId: info.messageId,
          message: `Email sent successfully to ${this.config.recipients.join(', ')}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

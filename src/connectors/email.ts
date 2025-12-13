import nodemailer from 'nodemailer';
import { BaseConnector } from './base';
import { Config } from '../types';

export class EmailConnector extends BaseConnector {
  name = 'send_email';
  private transporter: nodemailer.Transporter;
  private config: Config['email'];

  constructor(config: Config['email']) {
    super();
    this.config = config;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.appPassword
      }
    });
  }

  async execute(params: { subject: string; body: string }): Promise<any> {
    try {
      const info = await this.transporter.sendMail({
        from: this.config.user,
        to: this.config.recipient,
        subject: params.subject,
        html: params.body
      });

      return {
        success: true,
        messageId: info.messageId,
        message: `Email sent successfully to ${this.config.recipient}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

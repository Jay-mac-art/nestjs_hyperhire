
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Alert } from '../entity/alert.entity';
import { Chain } from 'src/common/constants/enums';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendAlert(chain: Chain, current: number, old: number): Promise<void> {
    try {
      const percentageIncrease = ((current - old) / old * 100).toFixed(2);

      const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            h2 { color: #007bff; }
            p { margin: 10px 0; }
            .highlight { font-weight: bold; color: #28a745; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Price Surge Alert for ${chain}</h2>
            <p>The price of <span class="highlight">${chain}</span> has increased by <span class="highlight">${percentageIncrease}%</span> in the last hour.</p>
            <p>Previous price (1 hour ago): <strong>$${old.toFixed(2)}</strong></p>
            <p>Current price: <strong>$${current.toFixed(2)}</strong></p>
            <p>Stay updated and consider your next steps!</p>
          </div>
        </body>
      </html>
    `;
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'hyperhire_assignment@hyperhire.in',
        subject: `${chain} Price Alert - Significant Increase Detected`,
        html: htmlContent,
      });

      this.logger.log(`Price alert email sent for ${chain}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send price alert for ${chain}: ${error.message}`,
        error.stack
      );
      throw new Error(`Failed to send price alert: ${error.message}`);
    }
  }

  async sendAlertTriggered(alert: Alert): Promise<void> {
    try {
      const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            h2 { color: #007bff; }
            p { margin: 10px 0; }
            .highlight { font-weight: bold; color: #28a745; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Price Target Alert: ${alert.chain} Goal Reached</h2>
            <p>The price of <span class="highlight">${alert.chain}</span> has hit or surpassed your target of <span class="highlight">$${alert.targetPrice.toFixed(2)}</span>.</p>
            <p>Current price: <strong>$${alert.targetPrice.toFixed(2)}</strong></p>
              <p>Thank you for using our alert service! 🚀</p>
            <p>We'll continue monitoring the prices for you.</p>
             <p>You can create new alerts anytime through our platform.</p>
          </div>
        </body>
      </html>
    `;


      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: alert.email,
        subject: `${alert.chain} Price Alert - Target Achieved`,
        html: htmlContent,
      });

      this.logger.log(
        `Alert triggered email sent to ${alert.email}: ${info.messageId}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to send alert to ${alert.email}: ${error.message}`,
        error.stack
      );
      throw new Error(
        `Failed to send price alert to ${alert.email}: ${error.message}`
      );
    }
  }

  async sendAlertConfirmation(alert: Alert): Promise<void> {
    try {
      const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            h2 { color: #007bff; }
            p { margin: 10px 0; }
            .highlight { font-weight: bold; color: #28a745; }
            .footer { margin-top: 20px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Alert Successfully Created! 🎉</h2>
            <p>We've successfully created your price alert for <span class="highlight">${alert.chain}</span>.</p>
            <p>Target price: <strong>$${alert.targetPrice.toFixed(2)}</strong></p>
            <p>Notification email: <strong>${alert.email}</strong></p>
            
            <div class="footer">
              <p>Thank you for using our service! We'll notify you when:</p>
              <ul>
                <li>The price reaches your target</li>
                <li>There are significant price movements</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
      `;
  
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: alert.email,
        subject: `${alert.chain} Price Alert Created Successfully`,
        html: htmlContent,
      });
  
      this.logger.log(
        `Alert confirmation sent to ${alert.email}: ${info.messageId}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to send alert confirmation to ${alert.email}: ${error.message}`,
        error.stack
      );
      throw new Error(
        `Failed to send alert confirmation: ${error.message}`
      );
    }
  }
}
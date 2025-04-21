import nodemailer from "nodemailer";

import { env } from "@/config/env";
import { getVerificationTemplate, getWelcomeTemplate } from "@/jobs/email/emailTemplates";

class Email {
  private to: string;
  private firstname: string;
  private from: string;

  constructor({ firstname, to }: { firstname: string; to: string }) {
    this.to = to;
    this.firstname = firstname;
    this.from = `Inkspire - <${env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      auth: {
        user: env.EMAIL_USERNAME,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  async send(html: string, subject: string) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };
    //create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendVerificationCode(code: string) {
    const html = getVerificationTemplate(this.firstname, code);
    await this.send(html, "Verify your account");
  }

  async sendWelcome() {
    const html = getWelcomeTemplate(this.firstname);
    await this.send(html, "Welcome to Organization-Name!");
  }
}

export default Email;

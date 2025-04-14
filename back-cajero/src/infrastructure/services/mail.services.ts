// src/infrastructure/services/mailer.service.ts
import nodemailer from "nodemailer";
import { envs } from "../../config/envs";

export class MailerService {
  private static transporter = nodemailer.createTransport({
    host: envs.EMAIL_HOST,
    port: envs.EMAIL_PORT,
    secure: true,
    auth: {
      user: envs.EMAIL_USER,
      pass: envs.EMAIL_PASSWORD,
    },
  });

  static async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<void> {
    const resetUrl = `${envs.FRONTEND_URL}/reset-password?token=${token}`;
    const expirationHours = 1; // Duración en horas (debe coincidir con tu lógica de expiración)

    await this.transporter.sendMail({
      from: `"Soporte Sistema" <${envs.EMAIL_FROM}>`,
      to: email,
      subject: "Recuperación de Contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Recuperación de Contraseña</h2>
          
          <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
          
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; 
                    border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Restablecer Contraseña
          </a>
          
          <p>Este enlace <strong>expirará en ${expirationHours} hora${
        expirationHours !== 1 ? "s" : ""
      }</strong>.</p>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>Si no solicitaste este cambio, ignora este mensaje. Tu contraseña permanecerá segura.</p>
            <p>Para mayor seguridad, no compartas este enlace con nadie.</p>
          </div>
        </div>
      `,
      text:
        `Para restablecer tu contraseña, visita este enlace: ${resetUrl}\n\n` +
        `Este enlace expirará en ${expirationHours} hora(s).\n\n` +
        `Si no solicitaste este cambio, ignora este mensaje.`,
    });
  }
}

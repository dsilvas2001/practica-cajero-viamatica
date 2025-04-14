import { MailerService } from "../../infrastructure/services/mail.services";
import { ForgotPasswordDatasource } from "../datasources/forgot-password.datasource";
import { UserDatasource } from "../datasources/user.datasource";

export class ForgotPasswordUseCase {
  constructor(private readonly datasource: ForgotPasswordDatasource) {}

  async execute(email: string): Promise<{ message: string }> {
    return await this.datasource.forgotPassword(email);
  }
}

export class ResetPasswordUseCase {
  constructor(private readonly datasource: ForgotPasswordDatasource) {}

  async execute(token: string, newPassword: string): Promise<any> {
    return await this.datasource.resetPassword(token, newPassword);
  }
}

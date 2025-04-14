import {
  ForgotPasswordDatasource,
  ForgotPasswordRepository,
} from "../../domain";

export class ForgotPasswordRepositoryImpl implements ForgotPasswordRepository {
  constructor(
    private readonly ForgotPasswordDatasource: ForgotPasswordDatasource
  ) {}

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.ForgotPasswordDatasource.forgotPassword(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    return this.ForgotPasswordDatasource.resetPassword(token, newPassword);
  }
}

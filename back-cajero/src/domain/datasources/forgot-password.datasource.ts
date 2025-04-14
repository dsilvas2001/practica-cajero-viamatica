export abstract class ForgotPasswordDatasource {
  abstract forgotPassword(email: string): Promise<{ message: string }>;
  abstract resetPassword(token: string, newPassword: string): Promise<any>;
}

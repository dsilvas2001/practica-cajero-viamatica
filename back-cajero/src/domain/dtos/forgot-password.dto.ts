import { UserValidator } from "../../infrastructure";

export class ForgotPasswordDto {
  private constructor(public readonly email: string) {}

  static create(object: { [key: string]: any }): [string?, ForgotPasswordDto?] {
    const { email } = object;
    if (!email) return ["Missing email"];
    return [undefined, new ForgotPasswordDto(email)];
  }
}

export class ResetPasswordDto {
  private constructor(
    public readonly token: string,
    public readonly newPassword: string
  ) {}

  static create(object: { [key: string]: any }): [string?, ResetPasswordDto?] {
    const { token, newPassword } = object;
    if (!token || !newPassword) return ["Token and new password are required"];
    if (!UserValidator.password.test(newPassword)) {
      return [
        "Password must contain at least one uppercase letter, one number, and be between 8 and 30 characters.",
      ];
    }

    return [undefined, new ResetPasswordDto(token, newPassword)];
  }
}

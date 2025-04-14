import { UserValidator } from "../../infrastructure/validators/user.validator";

export class UserDto {
  private constructor(
    public readonly userid: string,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly rolName?: string,
    public readonly userstatus_statusid?: string,
    public readonly createdById?: string
  ) {}

  // Método create (existente con pequeña mejora)
  static create(object: Record<string, any>): [string?, UserDto?] {
    const error = this.validateCommonFields(object, true);
    if (error) return [error];

    return [
      undefined,
      new UserDto(
        object.userid,
        object.username,
        object.email,
        object.password,
        object.rolName,
        object.userstatus_statusid,
        object.createdById
      ),
    ];
  }

  // Nuevo método update (password opcional)
  static update(object: Record<string, any>): [string?, UserDto?] {
    const error = this.validateCommonFields(object, false);
    if (error) return [error];

    return [
      undefined,
      new UserDto(
        object.userid,
        object.username,
        object.email,
        object.password || "", // Password opcional
        object.rolName,
        object.userstatus_statusid,
        object.createdById
      ),
    ];
  }

  // Validaciones compartidas (privado)
  private static validateCommonFields(
    object: Record<string, any>,
    requirePassword: boolean
  ): string | undefined {
    if (!object.username) return "Missing username";
    if (!UserValidator.username.test(object.username)) {
      return "Username must be between 8 and 20 characters and contain only letters and numbers.";
    }

    if (!object.email) return "Missing email";

    if (requirePassword) {
      if (!object.password) return "Missing password";
      if (!UserValidator.password.test(object.password)) {
        return "Password must contain at least one uppercase letter, one number, and be between 8 and 30 characters.";
      }
    }

    if (!object.rolName) return "Missing role name";

    return undefined;
  }
}

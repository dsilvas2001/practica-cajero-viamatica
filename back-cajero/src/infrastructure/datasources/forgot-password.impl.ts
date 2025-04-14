import { Repository } from "typeorm";
import { ForgotPasswordDatasource, UserModel } from "../../domain";
import { AppDataSource, PasswordResetToken, User } from "../../data";
import { BcryptAdapter } from "../security/bcrypt.security";
import { UserMapper } from "../mappers/user.mapper";
import * as crypto from "crypto";
import { CustomError } from "../errors/custom.error";
import { MailerService } from "../services/mail.services";
import { UserValidator } from "../validators/user.validator";

type hashFunction = (password: string) => string;
type compareFunction = (password: string, hashed: string) => boolean;

export class ForgotPasswordDatasourceImpl implements ForgotPasswordDatasource {
  private userRepository: Repository<User>;
  private passwordRepository: Repository<PasswordResetToken>;

  constructor(
    private readonly hashPassword: hashFunction = BcryptAdapter.hash,
    private readonly comparePassword: compareFunction = BcryptAdapter.compare
  ) {
    this.userRepository = AppDataSource.getRepository(User);
    this.passwordRepository = AppDataSource.getRepository(PasswordResetToken);
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["rol", "userStatus"],
    });
    return user ? UserMapper.databaseResultToUserModel(user) : null;
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de expiración

    // Eliminar tokens previos
    await this.passwordRepository.delete({ userId });

    // Guardar nuevo token
    await this.passwordRepository.save({
      token,
      expiresAt,
      user: { userid: userId },
    });

    return token;
  }

  async validatePasswordResetToken(token: string): Promise<UserModel> {
    const resetToken = await this.passwordRepository.findOne({
      where: { token },
      relations: ["user", "user.rol", "user.userStatus"],
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw CustomError.badRequest("Token inválido o expirado");
    }

    return UserMapper.databaseResultToUserModel(resetToken.user);
  }

  async updateUserPassword(
    userId: string,
    newPassword: string
  ): Promise<UserModel> {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
      relations: ["rol", "userStatus"],
    });

    if (!user) {
      throw CustomError.badRequest("Usuario no encontrado");
    }

    // Actualizar contraseña
    user.password = await this.hashPassword(newPassword);
    await this.userRepository.save(user);

    // Eliminar token usado
    await this.passwordRepository.delete({ userId });

    return UserMapper.databaseResultToUserModel(user);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Por seguridad, no revelar si el email existe
      return {
        message: "Si el email existe, se ha enviado un enlace de recuperación",
      };
    }

    const token = await this.createPasswordResetToken(user.userid);
    await MailerService.sendPasswordResetEmail(email, token);

    return {
      message: "Si el email existe, se ha enviado un enlace de recuperación",
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    // Validar token
    const user = await this.validatePasswordResetToken(token);

    // Validar nueva contraseña
    if (!UserValidator.password.test(newPassword)) {
      throw CustomError.badRequest(
        "La contraseña debe contener al menos una mayúscula, un número y tener entre 8 y 30 caracteres"
      );
    }

    // Actualizar contraseña
    return await this.updateUserPassword(user.userid, newPassword);
  }
}

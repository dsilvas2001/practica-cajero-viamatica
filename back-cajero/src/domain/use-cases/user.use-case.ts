import { UserDto } from "../dtos/user.dto";
import { UserModel } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";

export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Registra un nuevo usuario
   * @param currentUserId ID del usuario que realiza la acción (para auditoría)
   * @param clientDto Datos del usuario a registrar
   * @returns UserModel con los datos del usuario creado
   */
  async execute(currentUserId: string, clientDto: UserDto): Promise<UserModel> {
    return await this.userRepository.register(currentUserId, clientDto);
  }

  async executeBulkRegister(
    currentUserId: string,
    usersData: UserDto[]
  ): Promise<UserModel[]> {
    return await this.userRepository.bulkRegister(currentUserId, usersData);
  }

  /**
   * Obtiene todos los usuarios
   * @returns Array de UserModel
   */
  async executeAll(): Promise<UserModel[]> {
    return await this.userRepository.findAll();
  }

  /**
   * Actualiza un usuario existente
   * @param userId ID del usuario a actualizar
   * @param userUpdateDto Datos actualizados
   * @param currentUserId ID del usuario que realiza la acción
   * @returns UserModel actualizado
   */
  async executeUpdate(
    userId: string,
    userUpdateDto: UserDto,
    currentUserId: string
  ): Promise<UserModel> {
    return await this.userRepository.update(
      userId,
      userUpdateDto,
      currentUserId
    );
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   * @returns void
   */
  async executeDelete(currentUserId: string, userId: string): Promise<void> {
    return await this.userRepository.delete(currentUserId, userId);
  }
  /**
   * Validar un usuario
   * @param userId ID del usuario a validad
   * @returns void
   */
  async executeValidar(
    userId: string,
    currentUserId: string
  ): Promise<UserModel> {
    return await this.userRepository.validator(userId, currentUserId);
  }

  async executeUserCountRol(userId: string, rolName: string): Promise<any> {
    return await this.userRepository.getUserStatistics(userId, rolName);
  }
}

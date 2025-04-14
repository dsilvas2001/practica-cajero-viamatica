import {
  In,
  IsNull,
  MoreThanOrEqual,
  QueryFailedError,
  Repository,
} from "typeorm";
import {
  AppDataSource,
  Attention,
  Cash,
  PasswordResetToken,
  Rol,
  Turn,
  User,
  UserStatus,
} from "../../data";
import * as crypto from "crypto";
import { UserDatasource, UserDto, UserModel } from "../../domain";
import { CustomError } from "../errors/custom.error";
import { BcryptAdapter } from "../security/bcrypt.security";
import { UserMapper } from "../mappers/user.mapper";
import { UserValidator } from "../validators/user.validator";

type hashFunction = (password: string) => string;
type compareFunction = (password: string, hashed: string) => boolean;

export class UserDatasourceImpl implements UserDatasource {
  private userRepository: Repository<User>;
  private rolRepository: Repository<Rol>;

  constructor(
    private readonly hashPassword: hashFunction = BcryptAdapter.hash,
    private readonly comparePassword: compareFunction = BcryptAdapter.compare
  ) {
    this.userRepository = AppDataSource.getRepository(User);
    this.rolRepository = AppDataSource.getRepository(Rol);
  }

  /**
   *
   * @param currentUserId
   * @param createUserDto
   * @returns
   */

  async register(
    currentUserId: string,
    createUserDto: UserDto
  ): Promise<UserModel> {
    try {
      const { username, email, password, rolName, userstatus_statusid } =
        createUserDto;

      // 1. Validar usuario actual
      const currentUser = await this.validateCurrentUser(currentUserId);

      // 2. Validar rol objetivo y permisos
      const targetRole = await this.validateRoleCreationPermission(
        currentUser.rol.rolName,
        rolName!
      );

      // 3. Crear usuario
      const userCreated = await this.createUser(
        currentUser,
        targetRole,
        username,
        email,
        password,
        userstatus_statusid!
      );

      // 4. Retornar modelo mapeado
      return UserMapper.databaseResultToUserModel(userCreated);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === "23505") {
          throw CustomError.badRequest("A user with this email already exists");
        } else {
          throw CustomError.serverUnavailable(err.message);
        }
      } else if (err instanceof Error) {
        throw CustomError.serverUnavailable(err.message);
      } else {
        throw CustomError.serverUnavailable("An unknown error occurred");
      }
    }
  }

  private async validateCurrentUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userid: userId },
      relations: ["rol"],
    });

    if (!user?.rol) {
      throw CustomError.badRequest("Current user or role not found");
    }

    return user;
  }

  async bulkRegister(
    currentUserId: string,
    usersData: UserDto[]
  ): Promise<UserModel[]> {
    try {
      // 1. Validar usuario actual
      const currentUser = await this.validateCurrentUser(currentUserId);

      // 2. Procesar cada usuario
      const createdUsers: UserModel[] = [];

      for (const userData of usersData) {
        try {
          // Validar rol objetivo y permisos
          const targetRole = await this.validateRoleCreationPermission(
            currentUser.rol.rolName,
            userData.rolName!
          );

          // Crear usuario
          const userCreated = await this.createUser(
            currentUser,
            targetRole,
            userData.username,
            userData.email,
            userData.password, // Generar password si no viene
            userData.userstatus_statusid!
          );

          createdUsers.push(UserMapper.databaseResultToUserModel(userCreated));
        } catch (error) {
          // Registrar error pero continuar con los demás usuarios
          console.error(`Error al crear usuario ${userData.email}:`, error);
        }
      }

      return createdUsers;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw CustomError.serverUnavailable(err.message);
      } else if (err instanceof Error) {
        throw CustomError.serverUnavailable(err.message);
      } else {
        throw CustomError.serverUnavailable("An unknown error occurred");
      }
    }
  }

  private async createUser(
    currentUser: User,
    targetRole: Rol,
    username: string,
    email: string,
    password: string,
    statusId: string
  ): Promise<User> {
    const isAdmin = currentUser.rol.rolName === "Administrador";

    const user = this.userRepository.create({
      username,
      email,
      password: await this.hashPassword(password),
      userApproval: isAdmin,
      dateApproval: isAdmin ? new Date().toISOString() : null,
      rol: { rolid: targetRole.rolid },
      userStatus: { statusid: statusId },
      createdBy: { userid: currentUser.userid },
    });

    return await this.userRepository.save(user);
  }
  async update(
    userId: string,
    userUpdateDto: UserDto,
    currentUserId: string
  ): Promise<UserModel> {
    try {
      // 1. Validar que el usuario actual es administrador
      const currentUser = await this.userRepository.findOne({
        where: { userid: currentUserId },
        relations: ["rol"],
      });

      if (!currentUser) {
        throw CustomError.badRequest("Current user not found");
      }

      if (currentUser.rol.rolName !== "Administrador") {
        throw CustomError.badRequest("Only administrators can update users");
      }

      // 2. Verificar existencia del usuario a actualizar
      const existingUser = await this.userRepository.findOne({
        where: { userid: userId },
      });

      if (!existingUser) {
        throw CustomError.badRequest("User to update not found");
      }

      // 3. Preparar datos de actualización
      const updateData: Partial<User> = {
        username: userUpdateDto.username,
        email: userUpdateDto.email,
      };

      // Actualizar password solo si se proporciona
      if (userUpdateDto.password) {
        updateData.password = await this.hashPassword(userUpdateDto.password);
      }

      // Actualizar rol si se proporciona
      if (userUpdateDto.rolName) {
        const role = await this.rolRepository.findOne({
          where: { rolName: userUpdateDto.rolName },
        });

        if (!role) {
          throw CustomError.badRequest(
            `Role "${userUpdateDto.rolName}" not found`
          );
        }

        updateData.rol = { rolid: role.rolid } as Rol;
      }

      // Actualizar estado si se proporciona
      if (userUpdateDto.userstatus_statusid) {
        updateData.userStatus = {
          statusid: userUpdateDto.userstatus_statusid,
        } as UserStatus;
      }

      // 4. Ejecutar actualización
      await this.userRepository.update({ userid: userId }, updateData);

      // 5. Obtener y retornar usuario actualizado
      const updatedUser = await this.userRepository.findOneOrFail({
        where: { userid: userId },
        relations: ["rol", "userStatus", "createdBy"],
      });

      return UserMapper.databaseResultToUserModel(updatedUser);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === "23505") {
          throw CustomError.badRequest("Email or username already exists");
        }
        throw CustomError.serverUnavailable("Database error");
      }

      throw err instanceof CustomError
        ? err
        : CustomError.serverUnavailable("Update operation failed");
    }
  }
  async validator(userId: string, currentUserId: string): Promise<UserModel> {
    try {
      const validatedId = await this.userRepository.findOne({
        where: { userid: userId },
        relations: ["rol"],
      });
      if (!validatedId) {
        throw CustomError.badRequest("The user to be validated does not exist");
      }

      const currentUser = await this.userRepository.findOne({
        where: { userid: currentUserId },
        relations: ["rol"],
      });
      if (!currentUser) {
        throw CustomError.badRequest("Current user not found.");
      }

      if (currentUser.rol.rolName == "Administrador") {
        await this.userRepository.update(
          { userid: userId },
          {
            userApproval: true,
            dateApproval: new Date().toISOString(),
          }
        );
      } else {
        throw CustomError.badRequest(
          `${currentUser.rol.rolName} can't appovid user`
        );
      }
      return validatedId;
    } catch (err) {
      throw CustomError.serverUnavailable();
    }
  }

  private async validateRoleCreationPermission(
    currentUserRole: string,
    targetRoleName: string
  ): Promise<Rol> {
    // Definición de permisos por rol
    const rolePermissions: Record<string, string[]> = {
      Administrador: ["Administrador", "Gestor", "Cajero"],
      Gestor: ["Gestor", "Cajero"],
    };

    const targetRole = await this.rolRepository.findOne({
      where: { rolName: targetRoleName },
    });

    if (!targetRole) {
      throw CustomError.badRequest(`Role "${targetRoleName}" not found`);
    }

    if (!rolePermissions[currentUserRole]?.includes(targetRoleName)) {
      throw CustomError.badRequest(
        `Your role "${currentUserRole}" cannot create users with role "${targetRoleName}"`
      );
    }

    return targetRole;
  }

  async findAll(): Promise<UserModel[]> {
    const users = await this.userRepository.find({
      relations: ["rol", "userStatus", "createdBy"],
    });

    return UserMapper.databaseResultsToUserModels(users);
  }

  async delete(currentUserId: string, userId: string): Promise<void> {
    try {
      // 1. Validar que el usuario actual es administrador
      const currentUser = await this.userRepository.findOne({
        where: { userid: currentUserId },
        relations: ["rol"],
      });

      if (!currentUser) {
        throw CustomError.badRequest("Current user not found");
      }

      if (currentUser.rol.rolName !== "Administrador") {
        throw CustomError.badRequest("Only administrators can delete users");
      }

      // 2. Verificar existencia del usuario a eliminar
      const existingUser = await this.userRepository.findOne({
        where: { userid: userId },
      });

      if (!existingUser) {
        throw CustomError.badRequest("User to delete not found");
      }

      // 3. Ejecutar eliminación
      await this.userRepository.softDelete({ userid: userId });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw CustomError.internalServer();
      }
    }
  }

  async findByCredentials(email: string, password: string): Promise<UserModel> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        relations: ["rol", "userStatus", "createdBy"],
      });

      if (!user) {
        throw CustomError.badRequest("Invalid credentials");
      }

      const isPasswordValid = this.comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw CustomError.badRequest("Invalid credentials");
      }

      return user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw CustomError.internalServer();
      }
    }
  }

  async getUserStatistics(userId: string, rolName: string): Promise<any> {
    // 1. Validar usuario
    const user = await this.userRepository.findOne({
      where: { userid: userId },
      relations: ["rol"],
    });

    if (!user) throw CustomError.badRequest("Usuario no encontrado");

    // 2. Fecha actual (desde inicio del día)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const turnRepository = AppDataSource.getRepository(Turn);
    const attentionRepository = AppDataSource.getRepository(Attention);

    // 3. Estadísticas BASE (para todos los roles)
    const baseStats = {
      // Turnos ATENDIDOS hoy (con atención registrada)
      totalTurnosAtendidosHoy: await attentionRepository.count({
        where: {
          createdAt: MoreThanOrEqual(today),
          turn: { deletedAt: IsNull() }, // Solo turnos no cerrados
        },
        relations: ["turn"],
      }),
    };

    // 4. Estadísticas por ROL
    let roleStats = {};

    switch (rolName) {
      case "Gestor":
        roleStats = {
          // Turnos que ESTE GESTOR asignó hoy (a cualquier cajero)
          turnosAsignadosPorEl: await turnRepository.count({
            where: {
              userGestorId: userId,
              date: MoreThanOrEqual(today),
              deletedAt: IsNull(),
            },
          }),
          // Usuarios creados por él pendientes de aprobación
          usuariosPendientesAprobacion: await this.userRepository.count({
            where: {
              createdBy: { userid: userId },
              userApproval: false,
            },
          }),
        };
        break;

      case "Cajero":
        // Obtener cajas asignadas al cajero
        const cashRepository = AppDataSource.getRepository(Cash);
        const cashAssignments = await cashRepository.find({
          where: { users: { userid: userId } },
          relations: ["users"],
        });

        const cashIds = cashAssignments.map((cash) => cash.cashid);

        roleStats = {
          // Turnos ATENDIDOS por ESTE CAJERO hoy
          turnosAtendidosPorMi: await attentionRepository.count({
            where: {
              createdAt: MoreThanOrEqual(today),
              turn: {
                cash: { cashid: In(cashIds) },
                deletedAt: IsNull(),
              },
            },
            relations: ["turn", "turn.cash"],
          }),
        };
        break;

      case "Administrador":
        roleStats = {
          // Todos los turnos creados hoy (sin filtrar)
          totalTurnosCreadosHoy: await turnRepository.count({
            where: {
              date: MoreThanOrEqual(today),
              deletedAt: IsNull(),
            },
          }),
          // Todos los usuarios pendientes de aprobación
          usuariosPendientesAprobacion: await this.userRepository.count({
            where: { userApproval: false },
          }),
        };
        break;

      default:
        throw CustomError.badRequest("Rol no soportado");
    }

    return { ...baseStats, ...roleStats };
  }
}

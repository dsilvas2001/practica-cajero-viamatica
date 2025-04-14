import { UserDto, UserRepository, UserUseCase } from "../../domain";
import { CustomError } from "../../infrastructure";
import { Request, Response } from "express";
import { JwtAdapter } from "../../infrastructure/security/jwt.security";

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerUser = async (req: Request, res: Response): Promise<void> => {
    const { currentUserId, newUser } = req.body;
    const [error, userDto] = UserDto.create(newUser);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new UserUseCase(this.userRepository)
      .execute(currentUserId, userDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    new UserUseCase(this.userRepository)
      .executeAll()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
  bulkRegisterUser = async (req: Request, res: Response): Promise<void> => {
    const { currentUserId, usersData } = req.body;

    // Validar que usersData es un array
    if (!Array.isArray(usersData)) {
      res.status(400).json({ error: "usersData must be an array" });
      return;
    }

    const results = {
      total: usersData.length,
      success: 0,
      failed: 0,
      errors: [] as string[],
      createdUsers: [] as any[],
    };

    // Procesar cada usuario individualmente
    for (const userData of usersData) {
      try {
        const [error, userDto] = UserDto.create({
          ...userData,
          createdById: currentUserId,
        });

        if (error) {
          throw new Error(error);
        }

        // Usar el UserUseCase existente para cada usuario
        const createdUser = await new UserUseCase(
          this.userRepository
        ).executeBulkRegister(currentUserId, [userDto!]);

        results.success++;
        results.createdUsers.push(createdUser);
      } catch (error) {
        results.failed++;
        results.errors.push(
          `User ${userData.email || "unknown"}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    // Devolver resultados consolidados
    if (results.failed > 0) {
      res.status(207).json({
        // 207 Multi-Status
        message: `Completed with ${results.failed} errors`,
        ...results,
      });
    } else {
      res.status(201).json(results);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const { currentUserId, editUser } = req.body;
    const [error, userDto] = UserDto.update(editUser);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new UserUseCase(this.userRepository)
      .executeUpdate(userId, userDto!, currentUserId)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    const { currentUserId } = req.body;

    new UserUseCase(this.userRepository)
      .executeDelete(currentUserId, userId)
      .then(() => res.status(204).send())
      .catch((error) => this.handleError(error, res));
  };
  validatorUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    const { currentUserId } = req.body;

    new UserUseCase(this.userRepository)
      .executeValidar(userId, currentUserId)
      .then(() => res.status(204).send())
      .catch((error) => this.handleError(error, res));
  };

  findByCredentials = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findByCredentials(email, password);

      if (!user) {
        res.status(400).json({ user });
        return;
      }

      const token = await JwtAdapter.generateToken({
        id: user.userid,
        email: user.email,
        rol: user.rol!.rolName,
      });
      console.log("User Object:", user);

      res.status(200).json({
        email: user.email,
        password: user.password,
        token,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getUserCountRol = async (req: Request, res: Response): Promise<void> => {
    const { currentUserId, rolname } = req.params;
    new UserUseCase(this.userRepository)
      .executeUserCountRol(currentUserId, rolname)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
}

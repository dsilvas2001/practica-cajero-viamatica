import { IsNull, Repository } from "typeorm";
import { AppDataSource, Cash, Turn, User } from "../../data";
import {
  CashAssignmentDto,
  CashOperationDto,
  CashUserDatasource,
  CashWithUsersModel,
} from "../../domain";
import { CustomError } from "../errors/custom.error";
import { CashWithUsersMapper } from "../mappers/cash-user.mapper";

export class CashUserDatasourceImpl implements CashUserDatasource {
  private cashRepository: Repository<Cash>;
  private userRepository: Repository<User>;
  private turnRepository: Repository<Turn>;

  constructor() {
    this.cashRepository = AppDataSource.getRepository(Cash);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async assignUserToCash(data: CashAssignmentDto): Promise<CashWithUsersModel> {
    // Validar gestor
    const manager = await this.userRepository.findOne({
      where: { userid: data.gestorId },
      relations: ["rol"],
    });
    if (!manager || manager.rol.rolName !== "Gestor") {
      throw CustomError.badRequest("Solo gestores pueden asignar cajeros");
    }

    // Validar usuario cajero
    const user = await this.userRepository.findOne({
      where: { userid: data.userId },
      relations: ["rol"],
    });
    if (!user || user.rol.rolName !== "Cajero" || !user.userApproval) {
      throw CustomError.badRequest("Usuario cajero no válido o no aprobado");
    }

    // Obtener caja con usuarios asignados
    const cash = await this.cashRepository.findOne({
      where: { cashid: data.cashId },
      relations: ["users"],
    });
    if (!cash) throw CustomError.badRequest("Caja no encontrada");

    // Validar asignación existente
    if (cash.users.some((u) => u.userid === data.userId)) {
      throw CustomError.badRequest("Usuario ya asignado a esta caja");
    }

    // Validar límite de asignaciones
    if (cash.users.length >= 2) {
      throw CustomError.badRequest("La caja ya tiene 2 usuarios asignados");
    }

    // Asignar usuario
    cash.users.push(user);
    await this.cashRepository.save(cash);

    return this.getCashWithUsers(data.cashId);
  }

  async getCashWithUsers(cashId: string): Promise<CashWithUsersModel> {
    console.log("cashId", cashId);

    const cash = await this.cashRepository.findOne({
      where: { cashid: cashId },
      relations: ["users"],
    });
    console.log("cash", cash);

    if (!cash) throw CustomError.badRequest("Caja no encontrada");

    return CashWithUsersMapper.databaseResultToCashWithUsersModel(cash);
  }

  /**
   *
   * @returns
   */

  async openCash(data: CashOperationDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ userid: data.userId });
    if (!user) throw CustomError.badRequest("Usuario no encontrado");

    const cash = await this.cashRepository.findOne({
      where: { cashid: data.cashId },
      relations: ["users"],
    });
    if (!cash) throw CustomError.badRequest("Caja no encontrada");

    // Validar asignación del usuario a la caja
    if (!cash.users.some((u) => u.userid === data.userId)) {
      throw CustomError.badRequest("Usuario no asignado a esta caja");
    }

    // Buscar turnos activos (no eliminados)
    const turnRepository = AppDataSource.getRepository(Turn);
    const existingTurn = await turnRepository.findOne({
      where: {
        cash: { cashid: data.cashId },
        deletedAt: IsNull(), // Solo turnos no cerrados/eliminados
      },
    });
    if (existingTurn) throw CustomError.badRequest("Ya existe un turno activo");

    // Crear nuevo turno
    const newTurn = turnRepository.create({
      description: "ACTIVO",
      date: new Date(),
      cash: { cashid: data.cashId },
      userGestorId: data.userId,
    });
    await turnRepository.save(newTurn);
  }

  async closeCash(data: CashOperationDto): Promise<void> {
    const turnRepository = AppDataSource.getRepository(Turn);

    // Buscar turno activo (no eliminado)
    const activeTurn = await turnRepository.findOne({
      where: {
        cash: { cashid: data.cashId },
        deletedAt: IsNull(),
      },
    });
    if (!activeTurn) throw CustomError.badRequest("No hay turnos activos");

    // Validar usuario que cierra
    if (activeTurn.userGestorId !== data.userId) {
      throw CustomError.badRequest("Solo el gestor del turno puede cerrarlo");
    }

    // Marcar turno como cerrado (borrado lógico)
    activeTurn.deletedAt = new Date();
    await turnRepository.save(activeTurn);
  }

  async findAllCashWithUsers(): Promise<CashWithUsersModel[]> {
    // 1. Obtener todas las cajas con relaciones necesarias
    const cashes = await this.cashRepository.find({
      relations: [
        "users", // Usuarios asignados
        "turns", // Turnos relacionados
        "turns.cash", // Relación completa del turno
      ],
      order: {
        cashdescription: "ASC", // Orden opcional
      },
    });

    // 2. Usar el mapper para transformar los resultados
    return CashWithUsersMapper.databaseResultsToCashWithUsersModels(cashes);
  }
}

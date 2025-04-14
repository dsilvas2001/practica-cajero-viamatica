import { In, MoreThanOrEqual, Repository } from "typeorm";
import { TurnModel } from "../../domain/models/turn.model";
import { CustomError } from "../errors/custom.error";
import { TurnMapper } from "../mappers/turn.mapper";
import { AppDataSource, Cash, Turn, User } from "../../data";
import { TurnDto } from "../../domain/dtos/turn.dto";
import { TurnDatasource } from "../../domain/datasources/turn.datasource";

export class TurnDatasourceImpl implements TurnDatasource {
  private turnRepository: Repository<Turn>;
  private cashRepository: Repository<Cash>;
  private userRepository: Repository<User>;

  constructor() {
    this.turnRepository = AppDataSource.getRepository(Turn);
    this.cashRepository = AppDataSource.getRepository(Cash);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createTurn(data: TurnDto): Promise<TurnModel> {
    // Validar gestor
    const gestor = await this.userRepository.findOne({
      where: { userid: data.gestorId },
      relations: ["rol"],
    });

    if (!gestor || gestor.rol.rolName !== "Gestor") {
      throw CustomError.badRequest("Solo gestores pueden crear turnos");
    }

    // Validar caja
    const cash = await this.cashRepository.findOneBy({ cashid: data.cashId });
    if (!cash) throw CustomError.badRequest("Caja no encontrada");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validar turno único
    const existingTurn = await this.turnRepository.findOne({
      where: {
        description: data.description,
        createdAt: MoreThanOrEqual(today), // Filtra por turnos creados hoy
      },
    });

    if (existingTurn) {
      throw CustomError.badRequest(
        "Ya existe un turno con esta descripción hoy"
      );
    }

    // Crear turno
    const newTurn = this.turnRepository.create({
      description: data.description,
      cash: { cashid: data.cashId },
      userGestorId: data.gestorId,
    });

    await this.turnRepository.save(newTurn);

    // Obtener el turno recién creado con relaciones completas
    const createdTurn = await this.turnRepository.findOne({
      where: { turnid: newTurn.turnid },
      relations: ["cash"],
    });

    // Crear objeto con la información del gestor para el mapper
    const turnWithGestor = {
      ...createdTurn,
      gestor: {
        userid: gestor.userid,
        username: gestor.username,
        email: gestor.email,
      },
    };

    return TurnMapper.databaseResultToTurnModel(turnWithGestor);
  }

  async updateTurn(turnId: string, updateData: TurnDto): Promise<TurnModel> {
    // 1. Validar que el turno exista
    const existingTurn = await this.turnRepository.findOne({
      where: { turnid: turnId },
      relations: ["cash"],
    });

    if (!existingTurn) {
      throw CustomError.internalServer("Turno no encontrado");
    }

    // 2. Obtener información del usuario que realiza la actualización
    const user = await this.userRepository.findOne({
      where: { userid: updateData.gestorId },
      relations: ["rol"],
    });

    if (!user) {
      throw CustomError.badRequest("Gestor no encontrado");
    }

    // 3. Validaciones según rol
    if (user.rol.rolName === "Gestor") {
      // Gestor puede actualizar cualquier campo
      if (updateData.cashId) {
        const cash = await this.cashRepository.findOneBy({
          cashid: updateData.cashId,
        });
        if (!cash) throw CustomError.badRequest("Caja no encontrada");
        existingTurn.cash = { cashid: updateData.cashId } as Cash;
      }

      if (updateData.description) {
        // Validar que la nueva descripción no exista
        const turnWithSameDescription = await this.turnRepository.findOneBy({
          description: updateData.description,
        });
        if (
          turnWithSameDescription &&
          turnWithSameDescription.turnid !== turnId
        ) {
          throw CustomError.badRequest(
            "Ya existe un turno con esta descripción"
          );
        }
        existingTurn.description = updateData.description;
      }
    } else if (user.rol.rolName === "Cajero") {
      // Cajero solo puede actualizar campos específicos (ej. estado)
      // Aquí puedes agregar lógica específica para cajeros si es necesario
      throw CustomError.badRequest(
        "Los cajeros no pueden modificar turnos, solo atenderlos"
      );
    } else {
      throw CustomError.badRequest("Rol no autorizado para esta acción");
    }

    // 4. Guardar cambios
    await this.turnRepository.save(existingTurn);

    // 5. Obtener el turno actualizado con relaciones
    const updatedTurn = await this.turnRepository.findOne({
      where: { turnid: turnId },
      relations: ["cash"],
    });

    // 6. Obtener información del gestor original
    const gestor = await this.userRepository.findOne({
      where: { userid: existingTurn.userGestorId },
    });

    // 7. Preparar datos para el mapper
    const turnWithGestor = {
      ...updatedTurn,
      gestor: gestor
        ? {
            userid: gestor.userid,
            username: gestor.username,
            email: gestor.email,
          }
        : null,
    };

    return TurnMapper.databaseResultToTurnModel(turnWithGestor);
  }

  async getTurnsByCash(cashId: string): Promise<TurnModel[]> {
    // Primero obtenemos los turns con la relación de cash
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const turns = await this.turnRepository.find({
      where: { cash: { cashid: cashId }, createdAt: MoreThanOrEqual(today) },
      relations: ["cash"],
    });

    if (!turns || turns.length === 0) {
      throw CustomError.badRequest("No existe turnos de esta caja  hoy");
    }

    // Obtenemos los IDs de los gestores únicos
    const gestorIds = [...new Set(turns.map((turn) => turn.userGestorId))];

    // Obtenemos la información de los gestores
    const gestores = await this.userRepository.find({
      where: { userid: In(gestorIds) },
    });

    // Creamos un mapa para rápido acceso a la info del gestor
    const gestorMap = new Map(
      gestores.map((gestor) => [gestor.userid, gestor])
    );

    // Mapeamos los turns incluyendo la info del gestor
    const turnsWithGestor = turns.map((turn) => {
      const gestor = gestorMap.get(turn.userGestorId);
      return {
        ...turn,
        gestor: gestor
          ? {
              userId: gestor.userid,
              username: gestor.username,
              email: gestor.email,
            }
          : null,
      };
    });

    return TurnMapper.databaseResultsToTurnModels(turnsWithGestor);
  }

  async getAllTurns(): Promise<TurnModel[]> {
    // Obtener todos los turnos con sus relaciones
    const now = new Date();

    // Ajustar a hora local (si estás en UTC-5 por ejemplo, sumar 5 horas)
    // O usar Intl para extraer solo el "día" actual local, más exacto:
    const localDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const turns = await this.turnRepository.find({
      where: { createdAt: MoreThanOrEqual(localDate) },
      relations: ["cash"],
      order: { date: "DESC" }, // Ordenar por fecha descendente
    });

    if (!turns || turns.length === 0) {
      return [];
    }

    // Obtener IDs únicos de gestores
    const gestorIds = [...new Set(turns.map((turn) => turn.userGestorId))];

    // Obtener información de los gestores
    const gestores = await this.userRepository.find({
      where: { userid: In(gestorIds) },
    });

    console.log("gestores", gestores);

    // Crear mapa para acceso rápido a la información del gestor
    const gestorMap = new Map(
      gestores.map((gestor) => [gestor.userid, gestor])
    );

    // Combinar la información de turnos con gestores
    const turnsWithGestor = turns.map((turn) => {
      const gestor = gestorMap.get(turn.userGestorId);

      return {
        ...turn,
        gestor: gestor
          ? {
              userId: gestor.userid,

              username: gestor.username,
              email: gestor.email,
            }
          : null,
      };
    });

    return TurnMapper.databaseResultsToTurnModels(turnsWithGestor);
  }

  async deleteTurn(turnId: string, gestorId: string): Promise<void> {
    const turn = await this.turnRepository.findOneBy({ turnid: turnId });
    if (!turn) throw CustomError.badRequest("Turno no encontrado");

    if (turn.userGestorId !== gestorId) {
      throw CustomError.badRequest(
        "Solo el gestor asignado puede cerrar el turno"
      );
    }

    await this.turnRepository.softDelete({ turnid: turnId });
  }
}

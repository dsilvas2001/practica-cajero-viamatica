import { TurnModel } from "../../domain/models/turn.model";
import { CustomError } from "../errors/custom.error";

export class TurnMapper {
  /**
   * Convierte un registro de BD a TurnModel con validación estricta
   */
  static databaseResultToTurnModel(databaseResult: any): TurnModel {
    // Validación completa de todos los campos REQUERIDOS
    this.validateTurnDataFromDB(databaseResult);

    return new TurnModel(
      databaseResult.turnid,
      databaseResult.description,
      databaseResult.date,
      {
        cashId: databaseResult.cash?.cashid,
        cashdescription: databaseResult.cash?.cashdescription,
      },
      {
        userId: databaseResult.gestor?.userId,
        username: databaseResult.gestor?.username,
        email: databaseResult.gestor?.email,
      }
    );
  }

  /**
   * Validación estricta para datos que vienen de la base de datos
   */
  private static validateTurnDataFromDB(data: any): void {
    const requiredFields = [
      { field: data.turnid, message: "Turn ID is required in database record" },
      {
        field: data.description,
        message: "Description is required in database record",
      },
      { field: data.date, message: "Date is required in database record" },
      { field: data.cash, message: "Cash is required in database record" },
      {
        field: data.userGestorId,
        message: "Gestor ID is required in database record",
      },
    ];

    for (const { field, message } of requiredFields) {
      if (field === undefined || field === null) {
        throw CustomError.serverUnavailable(message);
      }
    }
  }

  /**
   * Convierte un array de resultados de BD a array de TurnModel
   */
  static databaseResultsToTurnModels(databaseResults: any[]): TurnModel[] {
    if (!databaseResults) {
      throw CustomError.badRequest("Database results array is required");
    }

    return databaseResults.map((result) => {
      try {
        return this.databaseResultToTurnModel(result);
      } catch (error) {
        console.error("Invalid turn data in database:", error);
        throw CustomError.serverUnavailable("Invalid turn data in database");
      }
    });
  }
}

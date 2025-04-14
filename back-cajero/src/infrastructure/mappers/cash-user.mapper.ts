import { CashWithUsersModel } from "../../domain";
import { CustomError } from "../errors/custom.error";

export class CashWithUsersMapper {
  /**
   * Convierte array de resultados de BD a array de CashWithUsersModel
   */
  static databaseResultsToCashWithUsersModels(
    databaseResults: any[]
  ): CashWithUsersModel[] {
    if (!databaseResults) {
      throw CustomError.badRequest("Database results array is required");
    }

    return databaseResults.map((result) =>
      this.databaseResultToCashWithUsersModel(result)
    );
  }

  /**
   * Convierte un registro de BD a CashWithUsersModel
   */
  static databaseResultToCashWithUsersModel(
    databaseResult: any
  ): CashWithUsersModel {
    this.validateCashDataFromDB(databaseResult);

    return new CashWithUsersModel(
      databaseResult.cashid,
      databaseResult.cashdescription,
      databaseResult.active,
      databaseResult.users?.map((user: any) => ({
        userId: user.userid,
        username: user.username,
        email: user.email,
      })) || [] // Array vacío si no hay usuarios
    );
  }

  /**
   * Validación estricta de datos de caja desde BD
   */
  private static validateCashDataFromDB(data: any): void {
    const requiredFields = [
      { field: data.cashid, message: "Cash ID is required" },
      { field: data.cashdescription, message: "Description is required" },
      { field: data.active, message: "Active status is required" },
    ];

    for (const { field, message } of requiredFields) {
      if (field === undefined || field === null) {
        throw CustomError.serverUnavailable(message);
      }
    }
  }
}

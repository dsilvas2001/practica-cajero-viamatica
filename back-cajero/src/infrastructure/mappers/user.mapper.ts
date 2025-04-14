import { User } from "../../data";
import { UserModel } from "../../domain";
import { CustomError } from "../errors/custom.error";

export class UserMapper {
  /**
   * Convierte un array de entidades User a array de UserModel
   */
  static databaseResultsToUserModels(databaseResults: User[]): UserModel[] {
    if (!databaseResults) {
      throw CustomError.badRequest("Database results array is required");
    }

    return databaseResults.map((result) =>
      this.databaseResultToUserModel(result)
    );
  }

  /**
   * Convierte una entidad User a UserModel
   */
  static databaseResultToUserModel(databaseResult: User): UserModel {
    this.validateUserDataFromDB(databaseResult);

    return new UserModel(
      databaseResult.userid,
      databaseResult.username,
      databaseResult.email,
      undefined, // Nunca exponer el password
      databaseResult.userApproval,
      databaseResult.dateApproval,
      databaseResult.createdBy
        ? { userid: databaseResult.createdBy.userid }
        : undefined,
      databaseResult.rol
        ? {
            rolid: databaseResult.rol.rolid,
            rolName: databaseResult.rol.rolName,
          }
        : undefined,
      databaseResult.userStatus
        ? {
            statusid: databaseResult.userStatus.statusid,
            description: databaseResult.userStatus.description,
          }
        : undefined,
      databaseResult.createdAt
    );
  }

  /**
   * Validación básica de estructura de datos desde BD
   */
  private static validateUserDataFromDB(data: User): void {
    const requiredFields = [
      { field: data.userid, message: "User ID is required in database record" },
      {
        field: data.username,
        message: "Username is required in database record",
      },
      { field: data.email, message: "Email is required in database record" },
      { field: data.rol, message: "Role is required in database record" },
      {
        field: data.userStatus,
        message: "Status is required in database record",
      },
    ];

    for (const { field, message } of requiredFields) {
      if (field === undefined || field === null) {
        throw CustomError.serverUnavailable(message);
      }
    }
  }
}

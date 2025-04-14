import { ClientDto, ClientModel } from "../../domain";
import { CustomError } from "../errors/custom.error";

export class ClientMapper {
  /**
   * Convierte un array de resultados de BD a array de ClientModel
   * con validación estricta de todos los campos en cada elemento
   */
  static databaseResultsToClientModels(databaseResults: any[]): ClientModel[] {
    if (!databaseResults) {
      throw CustomError.badRequest("Database results array is required");
    }

    // Validar y mapear cada registro individualmente
    return databaseResults.map((result) => {
      try {
        return this.databaseResultToClientModel(result);
      } catch (error) {
        console.error("Invalid client data in database:", error);
        throw CustomError.serverUnavailable("Invalid client data in database");
      }
    });
  }

  /**
   * Convierte un registro de BD a ClientModel con validación estricta
   */
  static databaseResultToClientModel(databaseResult: any): ClientModel {
    // Validación completa de todos los campos REQUERIDOS
    this.validateClientDataFromDB(databaseResult);

    return new ClientModel(
      databaseResult.clientid,
      databaseResult.name,
      databaseResult.lastname,
      databaseResult.identification,
      databaseResult.email,
      databaseResult.phonenumber,
      databaseResult.address,
      databaseResult.referenceaddress,
      databaseResult.createdAt
    );
  }

  /**
   * Validación estricta para datos que vienen de la base de datos
   */
  private static validateClientDataFromDB(data: any): void {
    const requiredFields = [
      {
        field: data.clientid,
        message: "Client ID is required in database record",
      },
      { field: data.name, message: "Name is required in database record" },
      {
        field: data.lastname,
        message: "Lastname is required in database record",
      },
      {
        field: data.identification,
        message: "Identification is required in database record",
      },
      { field: data.email, message: "Email is required in database record" },
      {
        field: data.phonenumber,
        message: "Phone number is required in database record",
      },
      {
        field: data.address,
        message: "Address is required in database record",
      },
      {
        field: data.referenceaddress,
        message: "Reference address is required in database record",
      },
    ];

    for (const { field, message } of requiredFields) {
      if (field === undefined || field === null) {
        throw CustomError.serverUnavailable(message);
      }
    }
  }
}

import { ContractModel } from "../../domain";
import { CustomError } from "../errors/custom.error";

export class ContractMapper {
  /**
   * Convierte un registro de BD a ContractModel con validación estricta
   */
  static databaseResultToContractModel(databaseResult: any): ContractModel {
    this.validateContractDataFromDB(databaseResult);

    return new ContractModel(
      databaseResult.contractid,
      databaseResult.startdate,
      databaseResult.enddate,
      {
        serviceId: databaseResult.service?.serviceid,
        serviceName: databaseResult.service?.servicename,
        serviceDescription: databaseResult.service?.servicedescription,
        price: databaseResult.service?.price,
      },
      {
        statusId: databaseResult.contractStatus?.statusid,
        description: databaseResult.contractStatus?.description,
      },
      {
        clientId: databaseResult.client?.clientid,
        name: databaseResult.client?.name,
        lastname: databaseResult.client?.lastname,
        identification: databaseResult.client?.identification,
        email: databaseResult.client?.email,
      },
      {
        methodId: databaseResult.methodPayment?.methodpaymentid,
        description: databaseResult.methodPayment?.description,
      }
    );
  }

  /**
   * Validación estricta para datos que vienen de la base de datos
   */
  private static validateContractDataFromDB(data: any): void {
    const requiredFields = [
      { field: data.contractid, message: "Contract ID is required" },
      { field: data.startdate, message: "Start date is required" },
      { field: data.enddate, message: "End date is required" },
      { field: data.service, message: "Service is required" },
      { field: data.contractStatus, message: "Contract status is required" },
      { field: data.client, message: "Client is required" },
      { field: data.methodPayment, message: "Payment method is required" },
    ];

    for (const { field, message } of requiredFields) {
      if (field === undefined || field === null) {
        throw CustomError.serverUnavailable(message);
      }
    }
  }

  /**
   * Convierte un array de resultados de BD a array de ContractModel
   */
  static databaseResultsToContractModels(
    databaseResults: any[]
  ): ContractModel[] {
    if (!databaseResults) {
      throw CustomError.badRequest("Database results array is required");
    }

    return databaseResults.map((result) => {
      try {
        return this.databaseResultToContractModel(result);
      } catch (error) {
        console.error("Invalid contract data in database:", error);
        throw CustomError.serverUnavailable(
          "Invalid contract data in database"
        );
      }
    });
  }
}

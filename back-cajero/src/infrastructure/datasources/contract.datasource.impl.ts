import { Repository } from "typeorm";
import {
  AppDataSource,
  Client,
  Contract,
  MethodPayment,
  Service,
  StatusContract,
} from "../../data";
import {
  ContractDatasource,
  ContractDto,
  ContractModel,
  UpdateContractDto,
} from "../../domain";
import { CustomError } from "../errors/custom.error";
import { ContractMapper } from "../mappers/contract.mapper";

export class ContractDatasourceImpl implements ContractDatasource {
  private contractRepository: Repository<Contract>;
  private serviceRepository: Repository<Service>;
  private clientRepository: Repository<Client>;
  private statusRepository: Repository<StatusContract>;
  private paymentMethodRepository: Repository<MethodPayment>;

  constructor() {
    this.contractRepository = AppDataSource.getRepository(Contract);
    this.serviceRepository = AppDataSource.getRepository(Service);
    this.clientRepository = AppDataSource.getRepository(Client);
    this.statusRepository = AppDataSource.getRepository(StatusContract);
    this.paymentMethodRepository = AppDataSource.getRepository(MethodPayment);
  }

  async createContract(data: ContractDto): Promise<ContractModel> {
    // 1. Validar el servicio
    const service = await this.serviceRepository.findOne({
      where: { serviceid: data.serviceId },
    });
    if (!service) {
      throw CustomError.badRequest("Servicio no encontrado");
    }

    // 2. Buscar cliente por identificación (cambio clave)
    const client = await this.clientRepository.findOne({
      where: { identification: data.clientIdentification },
    });
    if (!client) {
      throw CustomError.badRequest(
        "Cliente no encontrado con esta identificación"
      );
    }

    // 3. Validar método de pago
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { methodpaymentid: data.methodPaymentId },
    });
    if (!paymentMethod) {
      throw CustomError.badRequest("Método de pago no válido");
    }

    // 4. Obtener estado por defecto (VIG - Vigente)
    const defaultStatus = await this.statusRepository.findOne({
      where: { statusid: "VIG" },
    });
    if (!defaultStatus) {
      throw CustomError.serverUnavailable("Estado por defecto no configurado");
    }

    // 5. Crear el nuevo contrato
    const newContract = this.contractRepository.create({
      startdate: new Date(), // Fecha actual automática
      enddate: data.endDate,
      service: { serviceid: data.serviceId },
      client: { clientid: client.clientid }, // Usamos el ID encontrado
      methodPayment: { methodpaymentid: data.methodPaymentId },
      contractStatus: { statusid: "VIG" },
    });

    // 6. Guardar en base de datos
    await this.contractRepository.save(newContract);

    // 7. Obtener el contrato recién creado con todas las relaciones
    const createdContract = await this.contractRepository.findOne({
      where: { contractid: newContract.contractid },
      relations: ["service", "contractStatus", "client", "methodPayment"],
    });

    if (!createdContract) {
      throw CustomError.serverUnavailable(
        "Error al recuperar el contrato creado"
      );
    }

    // 8. Mapear a ContractModel usando tu mapper
    return ContractMapper.databaseResultToContractModel(createdContract);
  }

  async getAllContracts(): Promise<ContractModel[]> {
    // 1. Obtener todos los contratos con sus relaciones
    const contracts = await this.contractRepository.find({
      relations: ["service", "contractStatus", "client", "methodPayment"],
      order: {
        startdate: "DESC", // Ordenar por fecha de inicio (más recientes primero)
      },
    });

    // 2. Si no hay contratos, retornar array vacío
    if (!contracts || contracts.length === 0) {
      return [];
    }

    // 3. Mapear cada contrato a ContractModel usando tu mapper
    return ContractMapper.databaseResultsToContractModels(contracts);
  }

  async updateContract(
    contractId: string,
    updateData: UpdateContractDto
  ): Promise<ContractModel> {
    // 1. Verificar que el contrato existe (versión simplificada)
    const contract = await this.contractRepository.findOne({
      where: { contractid: contractId },
      relations: ["service", "contractStatus", "methodPayment"],
    });
    if (!contract) {
      throw CustomError.badRequest("Contrato no encontrado");
    }
    console.log("contract");
    console.log("contract");
    console.log(contract);

    // 2. Caso 1: Cambio de servicios
    if (updateData.newServiceId != contract.service.serviceid) {
      try {
        const result = await AppDataSource.query(
          "CALL sp_change_contract_service($1, $2, null)",
          [contractId, updateData.newServiceId]
        );
        return this.getContractById(result[0].p_new_contract_id);
      } catch (error) {
        this.handleProcedureError(error);
      }
    }

    // 3. Caso 2: Cancelación de contrato
    if (updateData.cancelContract) {
      try {
        const result = await AppDataSource.query(
          "CALL sp_cancel_contract($1)", // Sin casteo
          [contractId] // Debe ser un string UUID válido
        );

        console.log(result);
        return this.getContractById(contractId);
      } catch (error) {
        this.handleProcedureError(error);
      }
    }

    // 4. Caso 3: Cambio de método de pago
    if (
      updateData.newMethodPaymentId != contract.methodPayment.methodpaymentid
    ) {
      try {
        await AppDataSource.query("CALL sp_change_payment_method($1, $2)", [
          contractId,
          updateData.newMethodPaymentId,
        ]);
        return this.getContractById(contractId);
      } catch (error) {
        this.handleProcedureError(error);
      }
    }

    throw CustomError.badRequest("Ninguna operación válida especificada");
  }

  private handleProcedureError(error: any): never {
    console.error("Database Error Details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      query: error.query,
      parameters: error.parameters,
    });

    if (error.code === "42883") {
      // función no existe
      throw CustomError.serverUnavailable("Procedimiento no encontrado en BD");
    }
    if (error.message.includes("no encontrado")) {
      throw CustomError.badRequest(error.message);
    }
    // ... otros casos ...
    throw CustomError.serverUnavailable(
      `Error en base de datos: ${error.detail || error.message}`
    );
  }
  async getContractById(contractId: string): Promise<ContractModel> {
    // 1. Obtener el contrato con todas sus relaciones
    const contract = await this.contractRepository.findOne({
      where: { contractid: contractId },
      relations: ["service", "contractStatus", "client", "methodPayment"],
    });

    // 2. Validar que el contrato existe
    if (!contract) {
      throw CustomError.badRequest("Contrato no encontrado");
    }

    // 3. Mapear a ContractModel usando tu mapper
    return ContractMapper.databaseResultToContractModel(contract);
  }

  async deleteContract(contractId: string): Promise<void> {
    // 1. Verificar si el contrato existe
    const contract = await this.contractRepository.findOneBy({
      contractid: contractId,
    });
    if (!contract) {
      throw CustomError.badRequest("Contrato no encontrado");
    }

    // 2. Validar que no esté cancelado (opcional)
    if (contract.contractStatus?.statusid === "CAN") {
      throw CustomError.badRequest(
        "No se puede eliminar un contrato cancelado"
      );
    }

    // 3. Eliminar el contrato (borrado físico)
    await this.contractRepository.softDelete(contractId);
  }
}

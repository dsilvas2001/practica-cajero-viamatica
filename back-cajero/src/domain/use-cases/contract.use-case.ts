import { ContractDto, UpdateContractDto } from "../dtos/contract.dto";
import { ContractModel } from "../models/contract.model";
import { ContractRepository } from "../repositories/contract.repository";

export class ContractUseCase {
  constructor(private readonly contractRepository: ContractRepository) {}

  /**
   * Crea un nuevo contrato
   * @param contractDto Datos del contrato
   * @returns ContractModel con los datos del contrato creado
   */
  async executeCreate(contractDto: ContractDto): Promise<ContractModel> {
    return await this.contractRepository.createContract(contractDto);
  }

  /**
   * Obtiene todos los contratos
   * @returns Array de ContractModel
   */
  async executeGetAll(): Promise<ContractModel[]> {
    return await this.contractRepository.getAllContracts();
  }

  /**
   * Obtiene un contrato por ID
   * @param contractId ID del contrato
   * @returns ContractModel
   */
  async executeGetById(contractId: string): Promise<ContractModel> {
    return await this.contractRepository.getContractById(contractId);
  }

  /**
   * Actualiza un contrato existente
   * @param contractId ID del contrato a actualizar
   * @param updateData Datos actualizados
   * @returns ContractModel actualizado
   */
  async executeUpdate(
    contractId: string,
    updateData: UpdateContractDto
  ): Promise<ContractModel> {
    return await this.contractRepository.updateContract(contractId, updateData);
  }

  /**
   * Elimina un contrato
   * @param contractId ID del contrato a eliminar
   * @returns void
   */
  async executeDelete(contractId: string): Promise<void> {
    return await this.contractRepository.deleteContract(contractId);
  }
}

import {
  ContractDatasource,
  ContractDto,
  ContractModel,
  UpdateContractDto,
} from "../../domain";
import { ContractRepository } from "../../domain/repositories/contract.repository";

export class ContractRepositoryImpl implements ContractRepository {
  constructor(private readonly contractDatasource: ContractDatasource) {}

  async createContract(data: ContractDto): Promise<ContractModel> {
    return this.contractDatasource.createContract(data);
  }
  async updateContract(
    contractId: string,
    updateData: UpdateContractDto
  ): Promise<ContractModel> {
    return this.contractDatasource.updateContract(contractId, updateData);
  }

  async getAllContracts(): Promise<ContractModel[]> {
    return this.contractDatasource.getAllContracts();
  }

  async getContractById(contractId: string): Promise<ContractModel> {
    return this.contractDatasource.getContractById(contractId);
  }

  async deleteContract(contractId: string): Promise<void> {
    return this.contractDatasource.deleteContract(contractId);
  }
}

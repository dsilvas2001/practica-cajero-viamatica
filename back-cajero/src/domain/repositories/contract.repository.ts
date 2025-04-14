import { ContractDto, UpdateContractDto } from "../dtos/contract.dto";
import { ContractModel } from "../models/contract.model";

export abstract class ContractRepository {
  abstract createContract(data: ContractDto): Promise<ContractModel>;
  abstract getContractById(contractId: string): Promise<ContractModel>;
  abstract updateContract(
    contractId: string,
    updateData: UpdateContractDto
  ): Promise<ContractModel>;
  abstract getAllContracts(): Promise<ContractModel[]>;
  abstract deleteContract(contractId: string): Promise<void>;
}

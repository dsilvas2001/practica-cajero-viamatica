import { CashUserDatasource } from "../datasources/cash-user.datasource";
import { CashAssignmentDto } from "../dtos/cash-assignment.dto";
import { CashOperationDto } from "../dtos/cash-operation.dto";
import { CashWithUsersModel } from "../models/cash-user.model";

export class CashUserUseCase {
  constructor(private readonly cashDatasource: CashUserDatasource) {}

  async assignUserToCash(data: CashAssignmentDto): Promise<CashWithUsersModel> {
    return this.cashDatasource.assignUserToCash(data);
  }

  async getCashWithUsers(cashId: string): Promise<CashWithUsersModel> {
    return this.cashDatasource.getCashWithUsers(cashId);
  }

  async openCash(data: CashOperationDto): Promise<void> {
    return this.cashDatasource.openCash(data);
  }

  async closeCash(data: CashOperationDto): Promise<void> {
    return this.cashDatasource.closeCash(data);
  }

  async findAllCashWithUsers(): Promise<CashWithUsersModel[]> {
    return this.cashDatasource.findAllCashWithUsers();
  }
}

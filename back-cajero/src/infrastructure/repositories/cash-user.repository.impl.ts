import {
  CashAssignmentDto,
  CashOperationDto,
  CashUserDatasource,
  CashUserRepository,
  CashWithUsersModel,
} from "../../domain";

export class CashUserRepositoryImpl implements CashUserRepository {
  constructor(private readonly clientDatasource: CashUserDatasource) {}

  async assignUserToCash(
    addClientDto: CashAssignmentDto
  ): Promise<CashWithUsersModel> {
    return this.clientDatasource.assignUserToCash(addClientDto);
  }

  async findAllCashWithUsers(): Promise<CashWithUsersModel[]> {
    return this.clientDatasource.findAllCashWithUsers();
  }

  async openCash(data: CashOperationDto): Promise<void> {
    return this.clientDatasource.openCash(data);
  }

  async closeCash(data: CashOperationDto): Promise<void> {
    return this.clientDatasource.closeCash(data);
  }
  async getCashWithUsers(cashId: string): Promise<CashWithUsersModel> {
    return this.clientDatasource.getCashWithUsers(cashId);
  }
}

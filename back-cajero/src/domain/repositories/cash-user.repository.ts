import { CashAssignmentDto } from "../dtos/cash-assignment.dto";
import { CashOperationDto } from "../dtos/cash-operation.dto";
import { CashWithUsersModel } from "../models/cash-user.model";

export abstract class CashUserRepository {
  // Operaciones que no devuelven contenido (void)
  abstract assignUserToCash(
    data: CashAssignmentDto
  ): Promise<CashWithUsersModel>;
  abstract openCash(data: CashOperationDto): Promise<void>;
  abstract closeCash(data: CashOperationDto): Promise<void>;

  // Operación que devuelve datos estructurados
  abstract getCashWithUsers(cashId: string): Promise<CashWithUsersModel>;
  abstract findAllCashWithUsers(): Promise<CashWithUsersModel[]>;
}

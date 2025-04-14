import { TurnDatasource } from "../datasources/turn.datasource";
import { TurnDto } from "../dtos/turn.dto";
import { TurnModel } from "../models/turn.model";

export class TurnUseCase {
  constructor(private readonly turnDatasource: TurnDatasource) {}

  async createTurn(data: TurnDto): Promise<TurnModel> {
    return this.turnDatasource.createTurn(data);
  }
  async updateTurn(turnId: string, updateData: TurnDto): Promise<TurnModel> {
    return this.turnDatasource.updateTurn(turnId, updateData);
  }

  async getAllTurns(): Promise<TurnModel[]> {
    return this.turnDatasource.getAllTurns();
  }

  async getTurnsByCash(cashId: string): Promise<TurnModel[]> {
    return this.turnDatasource.getTurnsByCash(cashId);
  }

  async deleteTurn(turnId: string, gestorId: string): Promise<void> {
    return this.turnDatasource.deleteTurn(turnId, gestorId);
  }
}

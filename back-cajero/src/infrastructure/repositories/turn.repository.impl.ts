import {
  TurnDatasource,
  TurnDto,
  TurnModel,
  TurnRepository,
} from "../../domain";

export class TurnRepositoryImpl implements TurnRepository {
  constructor(private readonly turnDatasource: TurnDatasource) {}

  async createTurn(addClientDto: TurnDto): Promise<TurnModel> {
    return this.turnDatasource.createTurn(addClientDto);
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

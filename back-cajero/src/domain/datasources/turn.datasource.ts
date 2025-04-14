import { TurnDto } from "../dtos/turn.dto";
import { TurnModel } from "../models/turn.model";

export abstract class TurnDatasource {
  abstract createTurn(data: TurnDto): Promise<TurnModel>;
  abstract getTurnsByCash(cashId: string): Promise<TurnModel[]>;
  abstract updateTurn(turnId: string, updateData: TurnDto): Promise<TurnModel>;

  abstract getAllTurns(): Promise<TurnModel[]>;
  abstract deleteTurn(turnId: string, gestorId: string): Promise<void>;
}

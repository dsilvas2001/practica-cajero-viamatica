import { TurnDto, TurnRepository } from "../../domain";
import { TurnUseCase } from "../../domain/use-cases/turn.use-case";
import { CustomError } from "../../infrastructure";
import { Request, Response } from "express";

export class TurnController {
  constructor(private readonly turnRepository: TurnRepository) {} // Inyectamos Repository

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  createTurn = async (req: Request, res: Response): Promise<void> => {
    const [error, turnDto] = TurnDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new TurnUseCase(this.turnRepository)
      .createTurn(turnDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
  updateTurn = async (req: Request, res: Response): Promise<void> => {
    const turnId = req.params.turnId;
    const [error, turnDto] = TurnDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new TurnUseCase(this.turnRepository)
      .updateTurn(turnId, turnDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getAllTurns = async (req: Request, res: Response): Promise<void> => {
    new TurnUseCase(this.turnRepository)
      .getAllTurns()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
  getTurnsByCash = async (req: Request, res: Response): Promise<void> => {
    const cashId = req.params.cashId;

    new TurnUseCase(this.turnRepository)
      .getTurnsByCash(cashId)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteTurn = async (req: Request, res: Response): Promise<void> => {
    const turnId = req.params.turnId;
    const { gestorId } = req.body;

    new TurnUseCase(this.turnRepository)
      .deleteTurn(turnId, gestorId)
      .then(() => res.status(204).end())
      .catch((error) => this.handleError(error, res));
  };
}

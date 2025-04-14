import {
  CashAssignmentDto,
  CashOperationDto,
  CashUserRepository,
  CashUserUseCase,
} from "../../domain";
import { CustomError } from "../../infrastructure";
import { Request, Response } from "express";

export class CashUserController {
  constructor(private readonly cashUserRepository: CashUserRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  assignUserToCash = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = CashAssignmentDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new CashUserUseCase(this.cashUserRepository)
      .assignUserToCash(dto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getCashWithUsers = async (req: Request, res: Response): Promise<void> => {
    const cashId = req.params.cashId;

    new CashUserUseCase(this.cashUserRepository)
      .getCashWithUsers(cashId)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  openCash = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = CashOperationDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }
    new CashUserUseCase(this.cashUserRepository)
      .openCash(dto!)
      .then(() => res.status(204).end())
      .catch((error) => this.handleError(error, res));
  };

  closeCash = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = CashOperationDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new CashUserUseCase(this.cashUserRepository)
      .closeCash(dto!)
      .then(() => res.status(204).end())
      .catch((error) => this.handleError(error, res));
  };

  findAllCashWithUsers = async (req: Request, res: Response): Promise<void> => {
    new CashUserUseCase(this.cashUserRepository)
      .findAllCashWithUsers()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
}

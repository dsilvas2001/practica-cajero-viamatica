import { Request, Response } from "express";
import {
  ContractDto,
  ContractRepository,
  ContractUseCase,
  UpdateContractDto,
} from "../../domain";
import { CustomError } from "../../infrastructure";
export class ContractController {
  constructor(private readonly contractRepository: ContractRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  createContract = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = ContractDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new ContractUseCase(this.contractRepository)
      .executeCreate(dto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  getAllContracts = async (req: Request, res: Response): Promise<void> => {
    new ContractUseCase(this.contractRepository)
      .executeGetAll()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getContractById = async (req: Request, res: Response): Promise<void> => {
    const contractId = req.params.id;

    new ContractUseCase(this.contractRepository)
      .executeGetById(contractId)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateContract = async (req: Request, res: Response): Promise<void> => {
    const contractId = req.params.id;
    const [error, dto] = UpdateContractDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new ContractUseCase(this.contractRepository)
      .executeUpdate(contractId, dto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteContract = async (req: Request, res: Response): Promise<void> => {
    const contractId = req.params.id;

    new ContractUseCase(this.contractRepository)
      .executeDelete(contractId)
      .then(() => res.status(204).end())
      .catch((error) => this.handleError(error, res));
  };
}

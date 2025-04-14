import { ClientDto, ClientRepository, ClientUseCase } from "../../domain";
import { Request, Response } from "express";
import { CustomError } from "../../infrastructure";

export class ClientController {
  constructor(private readonly clientRepository: ClientRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerClient = async (req: Request, res: Response): Promise<void> => {
    const [error, clientDto] = ClientDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new ClientUseCase(this.clientRepository)
      .execute(clientDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getAllClients = async (req: Request, res: Response) => {
    new ClientUseCase(this.clientRepository)
      .executeAll()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  updateClient = async (req: Request, res: Response) => {
    const [error, clientDto] = ClientDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }
    new ClientUseCase(this.clientRepository)
      .executeUpdate(req.params.id, clientDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  deleteClient = async (req: Request, res: Response) => {
    new ClientUseCase(this.clientRepository)
      .executeDelete(req.params.id)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
}

import { ClientDto } from "../dtos/client.dto";
import { ClientModel } from "../models/client.model";

export abstract class ClientRepository {
  abstract register(addClientDto: ClientDto): Promise<ClientModel>;

  abstract findAll(): Promise<ClientModel[]>;

  abstract update(
    clientId: string,
    clientUpdateDto: ClientDto
  ): Promise<ClientModel>;

  abstract delete(clientId: string): Promise<void>;
}

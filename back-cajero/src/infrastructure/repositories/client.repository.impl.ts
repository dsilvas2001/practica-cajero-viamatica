import {
  ClientDatasource,
  ClientDto,
  ClientModel,
  ClientRepository,
} from "../../domain";

export class ClientRepositoryImpl implements ClientRepository {
  constructor(private readonly clientDatasource: ClientDatasource) {}

  async register(addClientDto: ClientDto): Promise<ClientModel> {
    return this.clientDatasource.register(addClientDto);
  }

  async update(
    clientId: string,
    clientUpdateDto: ClientDto
  ): Promise<ClientModel> {
    return this.clientDatasource.update(clientId, clientUpdateDto);
  }

  async findAll(): Promise<ClientModel[]> {
    return this.clientDatasource.findAll();
  }

  async delete(clientId: string): Promise<void> {
    return this.clientDatasource.delete(clientId);
  }
}

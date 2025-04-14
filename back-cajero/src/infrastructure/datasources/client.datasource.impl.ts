import { QueryFailedError, Repository } from "typeorm";
import { ClientDatasource, ClientDto, ClientModel } from "../../domain";
import { AppDataSource, Client } from "../../data";
import { CustomError } from "../errors/custom.error";
import { ClientMapper } from "../mappers/client.mapper";

export class ClientDatasourceImpl implements ClientDatasource {
  private clientRepository: Repository<Client>;

  constructor() {
    this.clientRepository = AppDataSource.getRepository(Client);
  }

  /**
   *
   * @param addClientDto
   * @returns
   */
  async register(addClientDto: ClientDto): Promise<ClientModel> {
    try {
      const clientId = crypto.randomUUID();
      const {
        name,
        lastname,
        identification,
        email,
        phonenumber,
        address,
        referenceaddress,
      } = addClientDto;

      const existingClient = await this.clientRepository.findOneBy({
        identification: identification,
      });

      if (existingClient) {
        throw CustomError.badRequest("Identification already exists");
      }

      const clientCreated = this.clientRepository.create({
        clientid: clientId,
        name: name,
        lastname: lastname,
        identification: identification,
        email: email,
        phonenumber: phonenumber,
        address: address,
        referenceaddress: referenceaddress,
      });
      const saved = await this.clientRepository.save(clientCreated);
      return ClientMapper.databaseResultToClientModel(saved);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === "23505") {
          throw CustomError.badRequest("A user with this email already exists");
        } else {
          throw CustomError.serverUnavailable(err.message);
        }
      } else if (err instanceof Error) {
        throw CustomError.serverUnavailable(err.message);
      } else {
        throw CustomError.serverUnavailable("An unknown error occurred");
      }
    }
  }

  /**
   *
   * @param clientId
   * @param clientUpdateDto
   * @returns
   */

  async update(
    clientId: string,
    clientUpdateDto: ClientDto
  ): Promise<ClientModel> {
    try {
      // 1. Verificar existencia del cliente
      const existingClient = await this.clientRepository.findOneBy({
        clientid: clientId,
      });

      if (!existingClient) {
        throw CustomError.badRequest("Client not found");
      }

      // 2. Actualizar en base de datos
      const updateResult = await this.clientRepository.update(
        { clientid: clientId },
        clientUpdateDto
      );

      if (updateResult.affected === 0) {
        throw CustomError.serverUnavailable("Update failed");
      }

      // 3. Obtener el cliente actualizado
      const updatedClient = await this.clientRepository.findOneBy({
        clientid: clientId,
      });

      if (!updatedClient) {
        throw CustomError.serverUnavailable("Failed to fetch updated client");
      }

      // 4. Convertir a Modelo usando el Mapper
      return ClientMapper.databaseResultToClientModel(updatedClient);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === "23505") {
          throw CustomError.badRequest("Duplicate key violation");
        }
      }
      throw err instanceof CustomError
        ? err
        : CustomError.serverUnavailable("Update operation failed");
    }
  }

  /**
   *
   * @returns
   */

  async findAll(): Promise<ClientModel[]> {
    try {
      const clients = await this.clientRepository.find();
      return ClientMapper.databaseResultsToClientModels(clients);
    } catch (err) {
      if (err instanceof Error) {
        throw CustomError.serverUnavailable(err.message);
      } else {
        throw CustomError.serverUnavailable("An unknown error occurred");
      }
    }
  }

  /**
   *
   * @param clientId
   */

  async delete(clientId: string): Promise<void> {
    try {
      const client = await this.clientRepository.findOneBy({
        clientid: clientId,
      });
      if (!client) {
        throw CustomError.badRequest("Client not exist");
      }

      await this.clientRepository.softDelete(clientId);
    } catch (err) {
      if (err instanceof Error) {
        throw CustomError.serverUnavailable(err.message);
      } else {
        throw CustomError.serverUnavailable("An unknown error occurred");
      }
    }
  }
}

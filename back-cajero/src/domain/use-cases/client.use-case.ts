import { ClientDto } from "../dtos/client.dto";
import { ClientRepository } from "../repositories/client.repository";

export class ClientUseCase {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(clientDto: ClientDto): Promise<any> {
    const cliente = await this.clientRepository.register(clientDto);

    return cliente;
  }
  async executeAll() {
    return await this.clientRepository.findAll();
  }
  async executeUpdate(id: string, clientDto: ClientDto) {
    return await this.clientRepository.update(id, clientDto);
  }
  async executeDelete(id: string) {
    return await this.clientRepository.delete(id);
  }
}

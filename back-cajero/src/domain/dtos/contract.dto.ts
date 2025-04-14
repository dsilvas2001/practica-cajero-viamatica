import { ClientValidator } from "../../infrastructure";

export class ContractDto {
  private constructor(
    public readonly serviceId: string,
    public readonly clientIdentification: string, // Cambiado de clientId a clientIdentification
    public readonly methodPaymentId: string,
    public readonly endDate: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, ContractDto?] {
    const { serviceId, clientIdentification, methodPaymentId, endDate } =
      object;

    // Validaciones básicas
    if (!serviceId) return ["serviceId es requerido"];
    if (!clientIdentification) return ["clientIdentification es requerido"];
    if (!methodPaymentId) return ["methodPaymentId es requerido"];
    if (!endDate) return ["endDate es requerido"];

    // Validar formato de identificación (13 caracteres)
    if (!ClientValidator.identification.test(clientIdentification))
      return ["Identification must be between 10 and 13 digits and numeric"];

    return [
      undefined,
      new ContractDto(
        serviceId,
        clientIdentification,
        methodPaymentId,
        new Date(endDate)
      ),
    ];
  }
}

export class UpdateContractDto {
  private constructor(
    public readonly newServiceId?: string, // Para cambio de servicio
    public readonly cancelContract?: boolean, // Para cancelación (true/false)
    public readonly newMethodPaymentId?: string // Para cambio de método de pago
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateContractDto?] {
    const { newServiceId, cancelContract, newMethodPaymentId } = object;

    if (!newServiceId) return ["newServiceId es requerido"];
    if (!newMethodPaymentId) return ["newMethodPaymentId es requerido"];

    return [
      undefined,
      new UpdateContractDto(newServiceId, cancelContract, newMethodPaymentId),
    ];
  }
}

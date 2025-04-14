export class ContractModel {
  constructor(
    public contractId: number,
    public startDate: Date,
    public endDate: Date,
    public service: {
      serviceId: string;
      serviceName: string;
      serviceDescription: string;
      price: number;
    },
    public status: {
      statusId: string;
      description: string;
    },
    public client: {
      clientId: string;
      name: string;
      lastname: string;
      identification: string;
      email: string;
    },
    public paymentMethod: {
      methodId: number;
      description: string;
    }
  ) {}
}

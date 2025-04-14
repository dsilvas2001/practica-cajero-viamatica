// Para respuesta de caja con usuarios asignados
export class CashWithUsersModel {
  constructor(
    public cashId: number,
    public cashDescription: string,
    public active: string,
    public assignedUsers?: Array<{
      userId: number;
      username: string;
      email: string;
    }>
  ) {}
}

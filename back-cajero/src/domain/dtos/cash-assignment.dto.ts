export class CashAssignmentDto {
  private constructor(
    public readonly cashId: string,
    public readonly userId: string,
    public readonly gestorId: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CashAssignmentDto?] {
    const { cashId, userId, gestorId } = object;

    if (!cashId) return ["Invalid cash ID"];
    if (!userId) return ["Invalid user ID"];
    if (!gestorId) return ["Invalid manager ID"];

    return [undefined, new CashAssignmentDto(cashId, userId, gestorId)];
  }
}

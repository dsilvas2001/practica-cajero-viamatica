export class CashOperationDto {
  private constructor(
    public readonly cashId: string,
    public readonly userId: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CashOperationDto?] {
    const { cashId, userId } = object;

    if (!cashId) return ["Invalid cash ID"];
    if (!userId) return ["Invalid user ID"];

    return [undefined, new CashOperationDto(cashId, userId)];
  }
}

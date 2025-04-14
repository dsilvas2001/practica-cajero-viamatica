import { TurnValidator } from "../../infrastructure";

export class TurnDto {
  private constructor(
    public readonly description: string,
    public readonly cashId: string,
    public readonly gestorId: string
  ) {}

  static create(object: { [key: string]: any }): [string?, TurnDto?] {
    const { description, cashId, gestorId } = object;

    // Validar campos requeridos
    if (!description || !cashId || !gestorId) {
      return ["Faltan campos obligatorios"];
    }

    // Validar formato del turno
    if (!TurnValidator.description.test(description)) {
      return ["Formato de turno inválido. Ejemplo: AC0001"];
    }

    // Validar tipo de atención
    const prefix = description.substring(0, 2);
    if (!TurnValidator.validType(prefix)) {
      return ["Tipo de atención no permitido (AC, PS, OT)"];
    }

    return [undefined, new TurnDto(description, cashId, gestorId)];
  }
}

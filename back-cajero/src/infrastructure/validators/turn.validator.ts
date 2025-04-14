// turn.validator.ts
export class TurnValidator {
  /**
   * Valida que la descripción del turno tenga 2 letras mayúsculas + 4 números
   * Ejemplo: AC0001, PS1234
   */
  static get description() {
    return /^[A-Z]{2}\d{4}$/;
  }

  /**
   * Valida los tipos de atención permitidos
   */
  static validType(prefix: string): boolean {
    const allowedTypes = ["AC", "PS"]; // Tipos permitidos
    return allowedTypes.includes(prefix);
  }
}

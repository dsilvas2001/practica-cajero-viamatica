export class ClientValidator {
  static get email() {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  }
  /**
   * Valida que la identificación tenga entre 10 y 13 digitos y solo numeros.
   */
  static get identification() {
    return /^\d{10,13}$/;
  }

  /**
   * Valida que la dirección tenga entre 20 y 100 caracteres.
   */
  static address(length: number) {
    return length >= 20 && length <= 100;
  }

  /**
   * Valida que la referencia de la dirección tenga entre 20 y 100 caracteres.
   */
  static referenceAddress(length: number) {
    return length >= 20 && length <= 100;
  }

  /**
   * Valida que el número de teléfono tenga al menos 10 dígitos, solo números, y empiece con 09.
   */
  static get phoneNumber() {
    return /^09\d{8,}$/;
  }
}

export class UserValidator {
  /**
   *
   */
  static get username() {
    return /^(?=.*\d)[A-Za-z0-9]{8,20}$/;
  }
  /**
   *
   */

  static get password() {
    return /^(?=.*\d)(?=.*[A-Z]).{8,30}$/;
  }
}

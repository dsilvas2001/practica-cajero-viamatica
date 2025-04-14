import { ClientValidator } from "../../infrastructure";

export class ClientDto {
  private constructor(
    public clientid: string,
    public name: string,
    public lastname: string,
    public identification: string,
    public email: string,
    public phonenumber: string,
    public address: string,
    public referenceaddress: string
  ) {}

  /**
   *
   * @param object
   * @returns
   */
  static create(object: { [key: string]: any }): [string?, ClientDto?] {
    const {
      clientid,
      name,
      lastname,
      identification,
      email,
      phonenumber,
      address,
      referenceaddress,
    } = object;

    if (!name) return ["Missing name"];
    if (!lastname) return ["Missing lastname"];

    if (!ClientValidator.identification.test(identification))
      return ["Identification must be between 10 and 13 digits and numeric"];

    if (!email) return ["Missing email"];
    if (!ClientValidator.email.test(email)) return ["Email is not valid"];

    if (!ClientValidator.phoneNumber.test(phonenumber))
      return ["Phone number must start with 09 and contain at least 10 digits"];

    if (!ClientValidator.address(address.length))
      return ["Address must be between 20 and 100 characters"];

    if (!ClientValidator.referenceAddress(referenceaddress.length))
      return ["Reference address must be between 20 and 100 characters"];

    return [
      undefined,
      new ClientDto(
        clientid,
        name,
        lastname,
        identification,
        email,
        phonenumber,
        address,
        referenceaddress
      ),
    ];
  }
}

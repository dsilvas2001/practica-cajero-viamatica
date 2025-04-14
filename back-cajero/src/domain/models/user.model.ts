export class UserModel {
  constructor(
    public userid: string,
    public username?: string,
    public email?: string,
    public password?: string,
    public userApproval?: boolean,
    public dateApproval?: string | null,
    public createdBy?: { userid: string },
    public rol?: { rolid: string; rolName: string },
    public userStatus?: { statusid: string; description: string },
    public createdAt?: Date
  ) {}
}

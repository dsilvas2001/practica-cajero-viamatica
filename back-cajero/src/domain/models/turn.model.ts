export class TurnModel {
  constructor(
    public turnId: string,
    public description: string,
    public openDate: Date,
    public cash: {
      cashId: string;
      cashdescription: string;
    },
    public gestor: {
      userId: string;
      username: string;
      email: string;
    }
  ) {}
}

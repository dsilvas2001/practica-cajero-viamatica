import {
  ForgotPasswordDto,
  ForgotPasswordRepository,
  ForgotPasswordUseCase,
  ResetPasswordDto,
  ResetPasswordUseCase,
} from "../../domain";
import { Response, Request } from "express";
import { CustomError } from "../../infrastructure";

export class ForgotPasswordController {
  constructor(
    private readonly forgotPasswordRepository: ForgotPasswordRepository
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statuscode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = ForgotPasswordDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new ForgotPasswordUseCase(this.forgotPasswordRepository)
      .execute(dto?.email!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = ResetPasswordDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new ResetPasswordUseCase(this.forgotPasswordRepository)
      .execute(dto!.token, dto!.newPassword)
      .then((user) =>
        res.json({
          message: "Password updated successfully",
          user: {
            userId: user.userid,
            email: user.email,
            username: user.username,
            rol: user.rol?.rolName,
          },
        })
      )
      .catch((error) => this.handleError(error, res));
  };
}

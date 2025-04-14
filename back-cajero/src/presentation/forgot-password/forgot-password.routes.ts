import { Router } from "express";
import {
  ForgotPasswordDatasourceImpl,
  ForgotPasswordRepositoryImpl,
} from "../../infrastructure";
import { ForgotPasswordController } from "./forgot-password.controller";

export class ForgotPasswordRoutes {
  static get routes(): Router {
    const router = Router();
    const datasourceI = new ForgotPasswordDatasourceImpl();
    const userRepositoryI = new ForgotPasswordRepositoryImpl(datasourceI);
    const controller = new ForgotPasswordController(userRepositoryI);

    router.post("/forgot-password", controller.forgotPassword);
    router.post("/reset-password", controller.resetPassword);

    return router;
    //
  }
}

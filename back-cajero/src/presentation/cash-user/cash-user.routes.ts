import { Router } from "express";
import {
  CashUserDatasourceImpl,
  CashUserRepositoryImpl,
} from "../../infrastructure";
import { CashUserController } from "./cash-user.controller";

export class CashUserRoutes {
  static get routes(): Router {
    const router = Router();
    const datasourceI = new CashUserDatasourceImpl();
    const userRepositoryI = new CashUserRepositoryImpl(datasourceI);
    const controller = new CashUserController(userRepositoryI);

    router.post("/assignUser", controller.assignUserToCash);
    router.get("/cashUser/:cashId", controller.getCashWithUsers);
    router.post("/openCash", controller.openCash);
    router.post("/closeCash", controller.closeCash);
    router.get("/", controller.findAllCashWithUsers);

    return router;
    //
  }
}

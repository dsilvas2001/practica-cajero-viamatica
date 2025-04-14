import { Router } from "express";
import { ClientRoutes } from "./client/client.routes";
import { UserRoutes } from "./user/user.routes";
import { CashUserRoutes } from "./cash-user/cash-user.routes";
import { TurnRoutes } from "./turn/turn.routes";
import { ContractRoutes } from "./contract/contract.routes";
import { ForgotPasswordRoutes } from "./forgot-password/forgot-password.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    console.log("PERO");

    router.use("/contract", ContractRoutes.routes);
    router.use("/client", ClientRoutes.routes);
    router.use("/user", UserRoutes.routes);
    router.use("/cash", CashUserRoutes.routes);
    router.use("/turn", TurnRoutes.routes);
    router.use("/turn", TurnRoutes.routes);
    router.use("/auth", ForgotPasswordRoutes.routes);

    return router;
  }
}

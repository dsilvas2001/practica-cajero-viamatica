import { Router } from "express";
import { UserDatasourceImpl, UserRepositoryImpl } from "../../infrastructure";
import { UserController } from "./user.controller";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const datasourceI = new UserDatasourceImpl();
    const userRepositoryI = new UserRepositoryImpl(datasourceI);
    const controller = new UserController(userRepositoryI);

    router.post("/register", controller.registerUser);
    router.get("/", controller.getAllUsers);
    router.put("/update/:id", controller.updateUser);
    router.post("/bulkregister", controller.bulkRegisterUser);

    router.delete("/delete/:id", controller.deleteUser);
    router.put("/validator/:id", controller.validatorUser);

    router.post("/auth", controller.findByCredentials);

    router.get("/count/:currentUserId/:rolname", controller.getUserCountRol);

    return router;
    //
  }
}

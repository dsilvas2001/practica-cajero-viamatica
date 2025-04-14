import { Router } from "express";
import {
  ContractDatasourceImpl,
  ContractRepositoryImpl,
} from "../../infrastructure";
import { ContractController } from "./contract.controller";

export class ContractRoutes {
  static get routes(): Router {
    const router = Router();
    const datasourceI = new ContractDatasourceImpl();
    const userRepositoryI = new ContractRepositoryImpl(datasourceI);
    const controller = new ContractController(userRepositoryI);

    // router.post("/register", controller.createContract);
    router.post("/register", controller.createContract);

    router.get("/", controller.getAllContracts);
    router.put("/update/:id", controller.updateContract);

    router.get("/:id", controller.getContractById);
    router.delete("/delete/:id", controller.deleteContract);

    return router;
    //
  }
}

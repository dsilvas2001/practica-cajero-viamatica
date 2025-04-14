import { Router } from "express";
import { TurnDatasourceImpl, TurnRepositoryImpl } from "../../infrastructure";
import { TurnController } from "./turn.controller";

export class TurnRoutes {
  static get routes(): Router {
    const router = Router();
    const datasourceI = new TurnDatasourceImpl();
    const clientRepositoryI = new TurnRepositoryImpl(datasourceI);
    const controller = new TurnController(clientRepositoryI);

    router.post("/register", controller.createTurn);

    router.get("/:cashId", controller.getTurnsByCash);
    router.get("/", controller.getAllTurns);
    router.put("/update/:id", controller.updateTurn);
    router.delete("/delete/:id", controller.deleteTurn);

    return router;
  }
}

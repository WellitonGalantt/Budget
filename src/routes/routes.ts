import { Router } from "express";
import UserRepository from "../repository/UserRepository";
import { UserService } from "../service/UserService";
import { authMiddleware } from "../middlewares.ts/authMiddleware";
import { ProfileRepository } from "../repository/ProfileRepository";
import { ProfileService } from "../service/ProfileService";
import { ProfileController } from "../controller/ProfileController";
import { ClientRepository } from "../repository/ClientRepository";
import { ClientService } from "../service/ClienteService";
import { ClientController } from "../controller/ClienteController";
import { BudgetController } from "../controller/BudgetController";
import { BudgetRepository } from "../repository/BudgetRepository";
import { BudgetService } from "../service/BudgetService";
import { validate } from "../middlewares.ts/validade";
import {
  createUserBodySchema,
  getUserParamsSchema,
  loginUserBodySchema,
} from "../types/userTypes";
import {
  createProfileBodySchema,
  deleteProfileParamsSchema,
  updateProfileBodySchema,
} from "../types/profileTypes";
import { UserController } from "../controller/UserController";
import {
  createBudgetBodySchema,
  createItemBudgetInputSchema,
  paramsBudgetIdSchema,
  updateBudgetInputSchema,
  updateItemBudgetInputSchema,
} from "../types/budgetTypes";
import {
  createClienteBodySchema,
  paramsClientIdSchema,
  updateClienteBodySchema,
} from "../types/clientTypes";

const routes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

const dudgetRepository = new BudgetRepository();
const budgetService = new BudgetService(dudgetRepository);
const budgetController = new BudgetController(budgetService);

routes.get("/", (_, res) => {
  res.send("Hello World!");
});

// ==== Users ====

routes.post(
  "/user/register",
  validate({ body: createUserBodySchema }),
  userController.create,
);

routes.post(
  "/user/login",
  validate({ body: loginUserBodySchema }),
  userController.login,
);

// routes.put("/user/update");
// routes.delete("/user/delete");

routes.get(
  "/user/profile/:id",
  authMiddleware,
  validate({ params: getUserParamsSchema }),
  userController.getUser,
);

routes.get("/user/verify", authMiddleware, userController.verify);

// ==== Profile ====

routes.post(
  "/profile/create",
  authMiddleware,
  validate({ body: createProfileBodySchema }),
  profileController.create,
);

routes.put(
  "/profile/update",
  authMiddleware,
  validate({ body: updateProfileBodySchema }),
  profileController.update,
);

routes.delete(
  "/profile/delete/:id",
  authMiddleware,
  validate({ params: deleteProfileParamsSchema }),
  profileController.delete,
);

// ==== Budgets ====

routes.post(
  "/budget/create",
  authMiddleware,
  validate({ body: createBudgetBodySchema }),
  budgetController.create,
);
routes.put(
  "/budget/update/:id",
  authMiddleware,
  validate({ body: updateBudgetInputSchema, params: paramsBudgetIdSchema }),
  budgetController.update,
);
routes.delete(
  "/budget/delete/:id",
  authMiddleware,
  validate({ params: paramsBudgetIdSchema }),
  budgetController.delete,
);
routes.get(
  "/budget/view/:id",
  authMiddleware,
  validate({ params: paramsBudgetIdSchema }),
  budgetController.getById,
);
routes.get("/budget/all", authMiddleware, budgetController.getAllBudgets);

// // -- Items --

routes.post(
  "/budget/item/create/:id",
  authMiddleware,
  validate({ body: createItemBudgetInputSchema, params: paramsBudgetIdSchema }),
  budgetController.createItemBudget,
);
routes.put(
  "/budget/item/update/:id",
  authMiddleware,
  validate({ body: updateItemBudgetInputSchema, params: paramsBudgetIdSchema }),
  budgetController.updateItemBudget,
);
routes.delete(
  "/budget/item/delete/:id",
  authMiddleware,
  validate({ params: paramsBudgetIdSchema }),
  budgetController.deleteItemBudget,
);
routes.get(
  "/budget/item/view/:id",
  authMiddleware,
  validate({ params: paramsBudgetIdSchema }),
  budgetController.getItemBudgetById,
);
routes.get(
  "/budget/item/all/:id",
  authMiddleware,
  validate({ params: paramsBudgetIdSchema }),
  budgetController.getAllItemsBudget,
);

// // -- Clients --

routes.post(
  "/client/create",
  authMiddleware,
  validate({ body: createClienteBodySchema }),
  clientController.create,
);
routes.put(
  "/client/update/:id",
  authMiddleware,
  validate({ body: updateClienteBodySchema, params: paramsClientIdSchema }),
  clientController.update,
);
routes.delete(
  "/client/delete/:id",
  authMiddleware,
  validate({ params: paramsClientIdSchema }),
  clientController.delete,
);
// routes.get("/client/view/:id");

export default routes;

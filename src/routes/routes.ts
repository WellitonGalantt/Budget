import { Router } from "express";
import UserRepository from "../repository/UserRepository";
import { UserController } from "../controller/userController";
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
// Users
// Profile
// Budgets
// Clients

routes.get("/", (req, res) => {
  res.send("Hello World!");
});

// // -- Users --

routes.post("/user/register", userController.create);
routes.post("/user/login", userController.login);
// routes.put("/user/update");
// routes.delete("/user/delete");
routes.get("/user/profile/:id", authMiddleware, userController.getUser); // Traz os dados do usuario e da empresa

// // -- Profile --

routes.post("/profile/create", authMiddleware, profileController.create);
routes.put("/profile/update", authMiddleware, profileController.update);
routes.delete("/profile/delete/:id", authMiddleware, profileController.delete);

// // -- Budgets --

routes.post("/budget/create", authMiddleware, budgetController.create);
routes.put("/budget/update/:id", authMiddleware, budgetController.update);
routes.delete("/budget/delete/:id", authMiddleware, budgetController.delete);
routes.get("/budget/view/:id", authMiddleware, budgetController.getById);
routes.get("/budget/all", authMiddleware, budgetController.getAllBudgets);

// // -- Items --

routes.post(
  "/budget/item/create/:id",
  authMiddleware,
  budgetController.createItemBudget,
);
routes.put(
  "/budget/item/update/:id",
  authMiddleware,
  budgetController.updateItemBudget,
);
routes.delete(
  "/budget/item/delete/:id",
  authMiddleware,
  budgetController.deleteItemBudget,
);
routes.get(
  "/budget/item/view/:id",
  authMiddleware,
  budgetController.getItemBudgetById,
);
routes.get(
  "/budget/item/all/:id",
  authMiddleware,
  budgetController.getAllItemsBudget,
);

// // -- Clients --

routes.post("/client/create", authMiddleware, clientController.create);
routes.put("/client/update/:id", authMiddleware, clientController.update);
routes.delete("/client/delete/:id", authMiddleware, clientController.delete);
// routes.get("/client/view/:id");

export default routes;

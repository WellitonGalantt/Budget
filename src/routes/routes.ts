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

// routes.post("budget/create");
// routes.put("budget/update");
// routes.delete("budget/delete");
// routes.get("budget/view");

// // -- Clients --

routes.post("/client/create", authMiddleware, clientController.create);
// routes.put("/client/update");
// routes.delete("/client/delete");
// routes.get("/client/view");

export default routes;

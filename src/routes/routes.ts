import { Router } from "express";
import UserRepository from "../repository/UserRepository";
import { UserController } from "../controller/userController";
import { UserService } from "../service/UserService";

const routes = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository)
const userController = new UserController(userService);

// Users
// Profile
// Budgets
// Clients

routes.get("/", (req, res) => {
  res.send("Hello World!");
});

// -- Users --

routes.post("/user/register", userController.create);
routes.post("/user/login", userController.login);
// routes.put("/user/update");
// routes.delete("/user/delete");
// routes.get("/user/profile"); // Traz os dados do usuario e da empresa

// // -- Profile --

// routes.post("profile/create");
// routes.put("profile/update");
// routes.delete("profile/delete");

// // -- Budgets --

// routes.post("budget/create");
// routes.put("budget/update");
// routes.delete("budget/delete");
// routes.get("budget/view");

// // -- Clients --

// routes.post("/client/create");
// routes.put("/client/update");
// routes.delete("/client/delete");
// routes.get("/client/view");

export default routes;
